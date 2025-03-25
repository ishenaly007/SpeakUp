package com.abit8.speakupengbot.bot;

import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.entity.Word;
import com.abit8.speakupengbot.db.service.QuizService;
import com.abit8.speakupengbot.db.service.SupportRequestService;
import com.abit8.speakupengbot.db.service.UserService;
import com.abit8.speakupengbot.db.service.WordService;
import com.abit8.speakupengbot.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.ParseMode;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.send.SendSticker;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.EditMessageText;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

@Component
public class SpeakUpEngBot extends TelegramLongPollingBot {

    private final List<String> finishQuotes;
    private final Random random = new Random();
    private final Map<Long, QuizSession> quizSessions = new ConcurrentHashMap<>(); // Ключ — userId
    private final Map<Long, State> userStates = new ConcurrentHashMap<>(); // Ключ — userId
    private final Map<Long, GroupQuizSession> groupQuizSessions = new ConcurrentHashMap<>(); // Ключ — chatId группы

    @Autowired
    private WordService wordService;

    @Autowired
    private QuizService quizService;

    @Autowired
    private TranslationService translationService;

    @Autowired
    private UserService userService;

    @Autowired
    private SupportRequestService supportRequestService;

    private static final Pattern CYRILLIC_PATTERN = Pattern.compile("[\\p{IsCyrillic}]");

    private static class State {
        private String word;

        private Boolean supportMode;

        public String getWord() {
            return word;
        }

        public void setWord(String word) {
            this.word = word;
        }

        public Boolean getSupportMode() {
            return supportMode;
        }

        public void setSupportMode(Boolean supportMode) {
            this.supportMode = supportMode;
        }
    }

    public SpeakUpEngBot() {
        List<String> loadedQuotes = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(
                Objects.requireNonNull(getClass().getClassLoader().getResourceAsStream("quote_finish_text.txt"))))) {
            String line;
            while ((line = br.readLine()) != null) {
                loadedQuotes.add(line);
            }
        } catch (Exception e) {
            System.err.println("Failed to load finish quotes: " + e.getMessage());
        }
        this.finishQuotes = loadedQuotes.isEmpty() ? Collections.singletonList("Хорошая работа\\!") : loadedQuotes;
    }

    @Override
    public String getBotUsername() {
        return "SpeakUpEngBot";
    }

    @Override
    public String getBotToken() {
        return System.getenv("TELEGRAM_BOT_TOKEN");
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage()) {
            long chatId = update.getMessage().getChatId();
            long userId = update.getMessage().getFrom().getId();
            String telegramUsername = update.getMessage().getFrom().getUserName();

            Optional<User> userOpt = userService.loginTelegramUser(userId);
            User user;
            if (!userOpt.isPresent()) {
                user = userService.registerTelegramUser(userId, telegramUsername);
            } else {
                user = userOpt.get();
            }
            if (update.getMessage().hasText()) {
                String messageText = update.getMessage().getText().trim();

                if (messageText.startsWith("/start join_")) {
                    joinGroupQuizFromDeepLink(chatId, userId, messageText);
                    return;
                }

                if (userStates.containsKey(userId)) {
                    State state = userStates.get(userId);
                    String word = messageText;
                    Optional<Word> foundWord = wordService.findWordByEnglish(word);
                    if (state.getSupportMode() != null && state.getSupportMode()) { // Проверка режима поддержки
                        supportRequestService.saveSupportRequest(user, telegramUsername, messageText);
                        sendMessage(chatId, "Ваше сообщение отправлено в поддержку\\! Мы скоро ответим\\.");
                        userStates.remove(userId);
                    } else if (foundWord.isPresent()) {
                        Word w = foundWord.get();
                        StringBuilder wordResponse = new StringBuilder();
                        wordResponse.append("*Слово:*\n*").append(escapeMarkdownV2(w.getEnglish())).append("* — ").append(escapeMarkdownV2(w.getRussian())).append("\n\n");
                        wordResponse.append("*Пример:*\n");
                        wordResponse.append("> _").append(escapeMarkdownV2(w.getExampleEn())).append("_\n");
                        if (!w.getExampleRu().isEmpty()) {
                            wordResponse.append("> *").append(escapeMarkdownV2(w.getExampleRu())).append("*");
                        }
                        state.setWord(word);
                        sendMessage(chatId, wordResponse.toString());
                        sendMessage(chatId, "Отправь стикер для этого слова\\.");
                    } else {
                        sendMessage(chatId, "Слово не найдено в базе\\. Попробуй другое\\.");
                        userStates.remove(userId);
                    }
                } else {
                    if (messageText.startsWith("/groupquiz")) {
                        String[] parts = messageText.split("\\s+", 2);
                        String theme = parts.length > 1 ? parts[1] : null;
                        startGroupQuiz(chatId, userId, theme);
                    } else if (messageText.startsWith("/startgroupquiz")) {
                        startGroupQuizForParticipants(chatId, userId);
                    } else if (messageText.startsWith("/finishgroupquiz")) {
                        finishGroupQuiz(chatId, userId);
                    } else if (messageText.startsWith("/quiz")) {
                        String[] parts = messageText.split("\\s+", 2);
                        String theme = parts.length > 1 ? parts[1] : null;
                        startQuiz(chatId, userId, theme);
                    } else {
                        switch (messageText) {
                            case "/start":
                                String welcomeText = "Добро пожаловать в @SpeakUpEngBot\\! Используй кнопки ниже или вводи слова/предложения на английском\\. Для викторины по теме используй: `/quiz <тема>`\\. Для группового квиза: `/groupquiz <тема>`";
                                sendMessageWithKeyboard(chatId, welcomeText, createMainKeyboard());
                                break;
                            case "Поддержка":
                            case "/support":
                                sendMessage(chatId, "Напишите вашу проблему или предложения\\.\nНаши специалисты скоро ответят\\(наверно или нет\\)\\.");
                                State state = new State();
                                state.setSupportMode(true);
                                userStates.put(userId, state);
                                break;
                            case "/profile":
                            case "Профиль":
                                sendProfile(chatId, user);
                                break;
                            case "Случайное слово":
                            case "/word":
                                Word word = wordService.getRandomWord();
                                if (word != null) {
                                    StringBuilder wordResponse = new StringBuilder();
                                    wordResponse.append("*Слово:*\n*").append(escapeMarkdownV2(word.getEnglish())).append("* — ").append(escapeMarkdownV2(word.getRussian())).append("\n\n");
                                    wordResponse.append("*Пример:*\n");
                                    wordResponse.append("> _").append(escapeMarkdownV2(word.getExampleEn())).append("_\n");
                                    if (!word.getExampleRu().isEmpty()) {
                                        wordResponse.append("> *").append(escapeMarkdownV2(word.getExampleRu())).append("*");
                                    }
                                    sendMessage(chatId, wordResponse.toString());
                                    if (word.getStickerId() != null && !word.getStickerId().isEmpty()) {
                                        sendSticker(chatId, word.getStickerId());
                                    }
                                }
                                break;
                            case "Викторина":
                                startQuiz(chatId, userId, null);
                                break;
                            case "/addsticker":
                                sendMessage(chatId, "Введи слово, для которого хочешь добавить стикер:");
                                userStates.put(userId, new State());
                                break;
                            default:
                                processInput(messageText, chatId);
                                break;
                        }
                    }
                }
            } else if (update.getMessage().hasSticker() && userStates.containsKey(userId)) {
                State state = userStates.get(userId);
                String word = state.getWord();
                String stickerFileId = update.getMessage().getSticker().getFileId();
                wordService.updateSticker(word, stickerFileId);
                sendMessage(chatId, "Стикер добавлен для слова *" + escapeMarkdownV2(word) + "*");
                userStates.remove(userId);
            }
        } else if (update.hasCallbackQuery()) {
            long chatId = update.getCallbackQuery().getMessage().getChatId();
            int messageId = update.getCallbackQuery().getMessage().getMessageId();
            String callbackData = update.getCallbackQuery().getData();
            long userId = update.getCallbackQuery().getFrom().getId();

            if (callbackData.startsWith("join_group_quiz_")) {
                String quizId = callbackData.split("_")[3];
                joinGroupQuiz(chatId, userId, quizId);
            } else {
                QuizSession session = quizSessions.get(userId);
                if (session != null) {
                    session.handleAnswer(callbackData, chatId, messageId);
                }
            }
        }
    }

    private void joinGroupQuizFromDeepLink(long chatId, long userId, String text) {
        String quizId = text.replace("/start join_", "");

        GroupQuizSession groupQuiz = groupQuizSessions.values().stream()
                .filter(g -> g.getQuizId().equals(quizId))
                .findFirst()
                .orElse(null);

        if (groupQuiz != null) {
            if (groupQuiz.addParticipant(userId)) {
                sendMessage(chatId, "Вы присоединились к групповому квизу\\! Ожидайте начала\\. ID квиза: *" + escapeMarkdownV2(quizId) + "*");
            } else {
                sendMessage(chatId, "Вы уже участвуете в этом квизе\\!");
            }
        } else {
            sendMessage(chatId, "Ошибка: групповой квиз с ID *" + escapeMarkdownV2(quizId) + "* не найден или завершен\\.");
        }
    }

    private void sendProfile(long chatId, User user) {
        StringBuilder profile = new StringBuilder();
        profile.append("👤 *Профиль:* ").append(escapeMarkdownV2(user.getUsername())).append("\n");
        //profile.append("📊 *Уровень:* ").append(user.getLevel() != null ? user.getLevel() : "Не задан").append("\n");
        profile.append("⭐ *XP:* ").append(user.getXp())
                .append("  (*").append(user.calculateLevel()).append("ур.*)\n");
        profile.append("📈 *Статистика:*\n");
        profile.append("  Квизов: ").append(quizService.getTotalQuizzes(user)).append("\n");
        profile.append("  Винрейт общий: ").append(quizService.getTotalWinrate(user)).append("\n");
        //profile.append("  Винрейт текущий(200): ").append(quizService.getRecentWinrate(user, 200)).append("\n");
        profile.append("  Выучено слов: ").append(wordService.countWordByUser(user)).append("\n");
        //profile.append("🏆 *Достижения:*\n"); // Пока пусто
        //profile.append("🔑 *Ключи:* ").append(user.getKeys());

        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText(profile.toString());
        message.setParseMode(ParseMode.MARKDOWN);
        try {
            execute(message);
        } catch (Exception e) {
            System.err.println("Failed to send profile: " + e.getMessage());
        }
    }

    private void processInput(String input, long chatId) {
        if (CYRILLIC_PATTERN.matcher(input).find()) {
            sendMessage(chatId, "Пожалуйста, введите слово или предложение на английском\\.");
            return;
        }

        String[] inputWords = input.split("\\s+");
        if (inputWords.length == 1) {
            String word = inputWords[0];
            Optional<Word> foundWord = wordService.findWordByEnglish(word);
            if (foundWord.isPresent()) {
                Word w = foundWord.get();
                StringBuilder wordResponse = new StringBuilder();
                wordResponse.append("*Слово:*\n*").append(escapeMarkdownV2(w.getEnglish())).append("* — ").append(escapeMarkdownV2(w.getRussian())).append("\n\n");
                wordResponse.append("*Пример:*\n");
                wordResponse.append("> _").append(escapeMarkdownV2(w.getExampleEn())).append("_\n");
                if (!w.getExampleRu().isEmpty()) {
                    wordResponse.append("> *").append(escapeMarkdownV2(w.getExampleRu())).append("*");
                }
                sendMessage(chatId, wordResponse.toString());
                if (w.getStickerId() != null && !w.getStickerId().isEmpty()) {
                    sendSticker(chatId, w.getStickerId());
                }
            } else {
                String translation = translationService.translate(word);
                if (translation != null) {
                    sendMessage(chatId, "*" + escapeMarkdownV2(word) + "* — " + escapeMarkdownV2(translation));
                    saveToFile(word, translation);
                } else {
                    sendMessage(chatId, "Не удалось перевести слово\\.");
                }
            }
        } else {
            String translation = translationService.translate(input);
            sendMessage(chatId, translation != null ? escapeMarkdownV2(translation) : "Не удалось перевести предложение\\.");
        }
    }

    private void saveToFile(String word, String translation) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("src/main/resources/none_eng_ru_word.txt", true))) {
            writer.write(word + ";" + translation + "\n");
        } catch (Exception e) {
            System.out.println("Failed to save word: " + e.getMessage());
        }
    }

    private String escapeMarkdownV2(String text) {
        return text.replaceAll("([_*\\[\\]()~`>#+\\-=|{}\\.!])", "\\\\$1");
    }

    private void sendMessage(long chatId, String text) {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText(text);
        message.setParseMode(ParseMode.MARKDOWNV2);
        try {
            execute(message);
            //System.out.println("Sent message to chatId: " + chatId);
        } catch (TelegramApiException e) {
            System.err.println("Failed to send message: " + e.getMessage());
        }
    }

    private void sendSticker(long chatId, String stickerFileId) {
        SendSticker sticker = new SendSticker();
        sticker.setChatId(String.valueOf(chatId));
        sticker.setSticker(new InputFile(stickerFileId));
        try {
            execute(sticker);
            //System.out.println("Sent sticker to chatId: " + chatId);
        } catch (TelegramApiException e) {
            System.err.println("Failed to send sticker: " + e.getMessage());
        }
    }

    private void sendMessageWithKeyboard(long chatId, String text, ReplyKeyboardMarkup keyboard) {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText(text);
        message.setParseMode(ParseMode.MARKDOWNV2);
        message.setReplyMarkup(keyboard);
        try {
            execute(message);
            //System.out.println("Sent message with keyboard to chatId: " + chatId);
        } catch (TelegramApiException e) {
            System.err.println("Failed to send message with keyboard: " + e.getMessage());
        }
    }

    private ReplyKeyboardMarkup createMainKeyboard() {
        ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
        keyboardMarkup.setResizeKeyboard(true);
        keyboardMarkup.setOneTimeKeyboard(false);
        List<KeyboardRow> keyboard = new ArrayList<>();
        KeyboardRow row = new KeyboardRow();
        KeyboardRow row2 = new KeyboardRow();
        row.add("Случайное слово");
        row.add("Викторина");
        row2.add("Поддержка");
        keyboard.add(row);
        keyboard.add(row2);
        keyboardMarkup.setKeyboard(keyboard);
        return keyboardMarkup;
    }

    private void startQuiz(long chatId, long userId, String theme) {
        QuizSession session = new QuizSession(chatId, userId, this, theme);
        quizSessions.put(userId, session); // Используем userId
        session.sendNextQuestion();
    }

    private void startGroupQuiz(long chatId, long creatorId, String theme) {
        String quizId = UUID.randomUUID().toString();
        GroupQuizSession groupQuiz = new GroupQuizSession(chatId, creatorId, quizId, theme, this);
        groupQuizSessions.put(chatId, groupQuiz);

        StringBuilder messageText = new StringBuilder();
        messageText.append("*Групповой квиз создан\\!*\n");
        messageText.append("Тема: *").append(theme != null ? escapeMarkdownV2(theme) : "без темы").append("*\n");
        messageText.append("Нажмите кнопку ниже, чтобы участвовать в квизе\\!\n");
        messageText.append("ID квиза: *").append(escapeMarkdownV2(quizId)).append("*"); // Optional: Show quizId for reference

        InlineKeyboardMarkup keyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();
        keyboard.add(Collections.singletonList(
                InlineKeyboardButton.builder()
                        .text("Участвовать")
                        .url("https://t.me/SpeakUpEngBot?start=join_" + quizId) // Deep link to bot
                        .build()
        ));
        keyboardMarkup.setKeyboard(keyboard);

        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText(messageText.toString());
        message.setParseMode(ParseMode.MARKDOWNV2);
        message.setReplyMarkup(keyboardMarkup);
        try {
            int messageId = execute(message).getMessageId();
            groupQuiz.setMessageId(messageId);
        } catch (TelegramApiException e) {
            System.err.println("Failed to send group quiz message: " + e.getMessage());
        }
    }

    private void joinGroupQuiz(long chatId, long userId, String quizId) {
        GroupQuizSession groupQuiz = groupQuizSessions.get(chatId);
        if (groupQuiz != null && groupQuiz.getQuizId().equals(quizId)) {
            if (groupQuiz.addParticipant(userId)) {
                sendMessage(userId, "Вы присоединились к групповому квизу\\! Ожидайте начала\\.");
            } else {
                sendMessage(userId, "Вы уже участвуете в этом квизе\\!");
            }
        } else {
            sendMessage(userId, "Этот групповой квиз не найден или завершен\\.");
        }
    }

    private void startGroupQuizForParticipants(long chatId, long creatorId) {
        GroupQuizSession groupQuiz = groupQuizSessions.get(chatId);
        if (groupQuiz == null || groupQuiz.getCreatorId() != creatorId) {
            sendMessage(chatId, "Вы не создатель этого квиза или квиз не найден\\!");
            return;
        }
        groupQuiz.startQuizForParticipants();
    }

    private void finishGroupQuiz(long chatId, long creatorId) {
        GroupQuizSession groupQuiz = groupQuizSessions.get(chatId);
        if (groupQuiz == null) {
            sendMessage(chatId, "Квиз не найден\\!");
            return;
        }
        if (groupQuiz.getCreatorId() != creatorId) {
            sendMessage(chatId, "Вы не создатель этого квиза\\!");
            return;
        }
        groupQuiz.finishQuiz();
        groupQuizSessions.remove(chatId);
        sendMessage(chatId, "Групповой квиз успешно завершен\\!");
    }

    private void editMessage(long chatId, int messageId, String text, InlineKeyboardMarkup keyboard) {
        EditMessageText editMessage = new EditMessageText();
        editMessage.setChatId(String.valueOf(chatId));
        editMessage.setMessageId(messageId);
        editMessage.setText(text);
        editMessage.setParseMode(ParseMode.MARKDOWNV2);
        if (keyboard != null) {
            editMessage.setReplyMarkup(keyboard);
        }
        try {
            execute(editMessage);
        } catch (TelegramApiException e) {
            System.err.println("Failed to edit message: " + e.getMessage());
            sendMessage(chatId, text);
        }
    }

    private class QuizSession {
        private final long chatId;
        private final long userId;
        private final SpeakUpEngBot bot;
        private final String theme;
        private int currentQuestion = 0;
        private int correctAnswers = 0;
        private int messageId; // Личный messageId
        private final Set<String> usedWords = new HashSet<>();
        private final List<Word> groupQuestions;
        private Long groupChatId; // ID группы
        private Integer groupMessageId; // ID сообщения в группе
        private final List<Word> correctWords = new ArrayList<>();
        private Word currentWord; // Текущее слово вопроса

        public QuizSession(long chatId, long userId, SpeakUpEngBot bot, String theme) {
            this.chatId = chatId;
            this.userId = userId;
            this.bot = bot;
            this.theme = theme;
            this.groupQuestions = null;
            this.groupChatId = null;
            this.groupMessageId = null;
        }

        public QuizSession(long chatId, long userId, SpeakUpEngBot bot, String theme, List<Word> groupQuestions, long groupChatId, int groupMessageId) {
            this.chatId = chatId;
            this.userId = userId;
            this.bot = bot;
            this.theme = theme;
            this.groupQuestions = groupQuestions;
            this.groupChatId = groupChatId;
            this.groupMessageId = groupMessageId;
        }

        public void sendNextQuestion() {
            if (currentQuestion >= 10) {
                finishQuiz();
                return;
            }

            currentWord = getNextWord(); // Сохраняем текущее слово
            if (currentWord == null) {
                if (currentQuestion == 0) {
                    bot.sendMessage(chatId, "Недостаточно слов для викторины" + (theme != null ? " по теме: *" + escapeMarkdownV2(theme) + "*" : ""));
                } else {
                    finishQuiz();
                }
                return;
            }
            usedWords.add(currentWord.getEnglish());

            Set<String> answers = new HashSet<>();
            answers.add(currentWord.getRussian());
            int maxAttempts = 10;
            int attempts = 0;
            while (answers.size() < 3 && attempts < maxAttempts) {
                Word wrongWord = theme != null ? wordService.getRandomWordByTheme(theme) : wordService.getRandomWord();
                if (wrongWord != null && !wrongWord.getEnglish().equals(currentWord.getEnglish()) && !usedWords.contains(wrongWord.getEnglish())) {
                    answers.add(wrongWord.getRussian());
                }
                attempts++;
            }
            if (answers.size() < 3) {
                if (currentQuestion == 0) {
                    bot.sendMessage(chatId, "Недостаточно уникальных слов" + (theme != null ? " по теме: *" + escapeMarkdownV2(theme) + "*" : "") + " для продолжения викторины.");
                } else {
                    finishQuiz();
                }
                return;
            }

            List<String> answerList = new ArrayList<>(answers);

            String question = "*Вопрос " + (currentQuestion + 1) + "/10:*\nКак перевести слово:\n> " + escapeMarkdownV2(currentWord.getEnglish());

            InlineKeyboardMarkup keyboardMarkup = new InlineKeyboardMarkup();
            List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();
            keyboard.add(Collections.singletonList(
                    InlineKeyboardButton.builder().text(answerList.get(0)).callbackData(answerList.get(0).equals(currentWord.getRussian()) ? "correct" : "wrong").build()
            ));
            keyboard.add(Collections.singletonList(
                    InlineKeyboardButton.builder().text(answerList.get(1)).callbackData(answerList.get(1).equals(currentWord.getRussian()) ? "correct" : "wrong").build()
            ));
            keyboard.add(Collections.singletonList(
                    InlineKeyboardButton.builder().text(answerList.get(2)).callbackData(answerList.get(2).equals(currentWord.getRussian()) ? "correct" : "wrong").build()
            ));
            keyboardMarkup.setKeyboard(keyboard);

            if (currentQuestion == 0) {
                SendMessage message = new SendMessage();
                message.setChatId(String.valueOf(chatId));
                message.setText(question);
                message.setParseMode(ParseMode.MARKDOWNV2);
                message.setReplyMarkup(keyboardMarkup);
                try {
                    messageId = execute(message).getMessageId();
                    //System.out.println("Sent quiz question to chatId: " + chatId);
                } catch (TelegramApiException e) {
                    System.err.println("Failed to send quiz: " + e.getMessage());
                }
            } else {
                editMessage(chatId, messageId, question, keyboardMarkup);
            }
            currentQuestion++;
        }

        public void handleAnswer(String callbackData, long chatId, int messageId) {
            if (callbackData.equals("correct")) {
                correctAnswers++;
                if (currentWord != null) {
                    correctWords.add(currentWord); // Добавляем текущее слово в список выученных
                }
            }

            this.messageId = messageId;
            if (currentQuestion < 10) {
                sendNextQuestion();
            } else {
                finishQuiz();
            }
        }

        private Word getNextWord() {
            if (groupQuestions != null) {
                return currentQuestion < groupQuestions.size() ? groupQuestions.get(currentQuestion) : null;
            } else {
                int maxAttempts = 10;
                int attempts = 0;
                Word word;
                do {
                    word = theme != null ? wordService.getRandomWordByTheme(theme) : wordService.getRandomWord();
                    attempts++;
                    if (word == null || attempts >= maxAttempts) {
                        return null;
                    }
                } while (usedWords.contains(word.getEnglish()));
                return word;
            }
        }

        private void finishQuiz() {
            int percentage = (correctAnswers * 100) / 10;
            String emoji = percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "😅";
            String quote = finishQuotes.get(random.nextInt(finishQuotes.size()));

            StringBuilder result = new StringBuilder();
            result.append("*Викторина завершена\\!* ").append(emoji).append("\n");
            if (theme != null) {
                result.append("Тема: *").append(escapeMarkdownV2(theme)).append("*\n");
            }
            result.append("Правильных ответов: ").append(correctAnswers).append("/10 \\(").append(percentage).append("%\\)\n\n");
            result.append("⭐ *\\+").append(correctAnswers).append("XP* за правильные ответы");
            if (correctAnswers == 10) {
                result.append(", *\\+5XP* бонус за 100%\\!");
            }
            result.append("\n\n");
            if (groupChatId != null && groupMessageId != null) {
                String groupIdStr = String.valueOf(groupChatId).replace("-100", "");
                String groupLink = "[Узнать результаты других участников](https://t.me/c/" + groupIdStr + "/" + groupMessageId + ")";
                result.append(groupLink).append("\n\n");
            }
            result.append("*На заметку:*\n> ").append(escapeMarkdownV2(quote));

            editMessage(chatId, messageId, result.toString(), null);
            User user = userService.loginTelegramUser(userId).orElse(null);
            if (user != null) {
                quizService.saveQuizResult(user, correctAnswers, 10, correctWords);
            }
            quizSessions.remove(userId);

            GroupQuizSession groupQuiz = groupQuizSessions.values().stream()
                    .filter(g -> g.participantSessions.containsKey(userId))
                    .findFirst()
                    .orElse(null);
            if (groupQuiz != null && groupQuiz.allParticipantsFinished()) {
                groupQuiz.finishQuiz();
                groupQuizSessions.remove(groupQuiz.chatId);
            }
        }

        // Остальные методы остаются без изменений
        public int getCorrectAnswers() {
            return correctAnswers;
        }

        public long getChatId() {
            return chatId;
        }

        public long getUserId() {
            return userId;
        }

        public SpeakUpEngBot getBot() {
            return bot;
        }

        public String getTheme() {
            return theme;
        }

        public int getCurrentQuestion() {
            return currentQuestion;
        }

        public void setCurrentQuestion(int currentQuestion) {
            this.currentQuestion = currentQuestion;
        }

        public void setCorrectAnswers(int correctAnswers) {
            this.correctAnswers = correctAnswers;
        }

        public int getMessageId() {
            return messageId;
        }

        public void setMessageId(int messageId) {
            this.messageId = messageId;
        }

        public Set<String> getUsedWords() {
            return usedWords;
        }
    }

    private class GroupQuizSession {
        private final long chatId;
        private final long creatorId;
        private final String quizId;
        private final String theme;
        private final SpeakUpEngBot bot;
        private int messageId;
        private final Set<Long> participants;
        private final Map<Long, QuizSession> participantSessions;
        private boolean isStarted;
        private final List<Word> groupQuestions;

        public GroupQuizSession(long chatId, long creatorId, String quizId, String theme, SpeakUpEngBot bot) {
            this.chatId = chatId;
            this.creatorId = creatorId;
            this.quizId = quizId;
            this.theme = theme;
            this.bot = bot;
            this.participants = new HashSet<>();
            this.participantSessions = new ConcurrentHashMap<>();
            this.isStarted = false;
            this.groupQuestions = generateGroupQuestions();
        }

        private List<Word> generateGroupQuestions() {
            List<Word> questions = new ArrayList<>();
            Set<String> usedWords = new HashSet<>();
            int maxAttempts = 50;
            int attempts = 0;

            while (questions.size() < 10 && attempts < maxAttempts) {
                Word word = theme != null ? wordService.getRandomWordByTheme(theme) : wordService.getRandomWord();
                if (word != null && !usedWords.contains(word.getEnglish())) {
                    questions.add(word);
                    usedWords.add(word.getEnglish());
                }
                attempts++;
            }
            return questions.size() == 10 ? questions : Collections.emptyList();
        }

        public boolean addParticipant(long userId) {
            if (isStarted) {
                return false;
            }
            return participants.add(userId);
        }

        public void startQuizForParticipants() {
            if (isStarted) {
                bot.sendMessage(chatId, "Квиз уже начат\\!");
                return;
            }
            if (participants.isEmpty()) {
                bot.sendMessage(chatId, "Нет участников для квиза\\!");
                return;
            }
            if (groupQuestions.isEmpty()) {
                bot.sendMessage(chatId, "Недостаточно слов для группового квиза" + (theme != null ? " по теме: *" + escapeMarkdownV2(theme) + "*" : ""));
                groupQuizSessions.remove(chatId);
                return;
            }
            isStarted = true;
            for (long userId : participants) {
                QuizSession session = new QuizSession(userId, userId, bot, theme, groupQuestions, chatId, messageId);
                participantSessions.put(userId, session);
                quizSessions.put(userId, session);
                session.sendNextQuestion();
            }
            bot.sendMessage(chatId, "Групповой квиз начался\\! Участники, проверьте личные сообщения\\.");
        }

        public void finishQuiz() {
            StringBuilder result = new StringBuilder();
            result.append("*Групповой квиз завершен\\!*\n");
            result.append("Тема: *").append(theme != null ? escapeMarkdownV2(theme) : "без темы").append("*\n\n");
            result.append("Результаты:\n");
            int rating = 1;
            for (Map.Entry<Long, QuizSession> entry : participantSessions.entrySet()) {

                long userId = entry.getKey();
                QuizSession session = entry.getValue();
                int score = session.getCorrectAnswers();
                int percentage = (score * 100) / 10;
                String username = userService.getUsernameById(userId);
                result.append(rating + "\\. ").append(escapeMarkdownV2(username != null ? username : "Unknown")).append(" — ").append(score).append("\\/10 \\(").append(percentage).append("%\\)\n");
                quizSessions.remove(userId);
                rating++;
            }

            try {
                bot.sendMessage(chatId, result.toString());
                //editMessage(chatId, messageId, result.toString(), null);
            } catch (Exception e) {
                System.err.println("Failed to edit group quiz message: " + e.getMessage());
                bot.sendMessage(chatId, result.toString());
            }
        }

        public boolean allParticipantsFinished() {
            return participantSessions.values().stream().allMatch(s -> s.currentQuestion >= 10);
        }

        public void setMessageId(int messageId) {
            this.messageId = messageId;
        }

        public long getCreatorId() {
            return creatorId;
        }

        public String getQuizId() {
            return quizId;
        }
    }

    public List<String> getFinishQuotes() {
        return finishQuotes;
    }

    public Random getRandom() {
        return random;
    }

    public Map<Long, QuizSession> getQuizSessions() {
        return quizSessions;
    }

    public Map<Long, State> getUserStates() {
        return userStates;
    }

    public WordService getWordService() {
        return wordService;
    }

    public void setWordService(WordService wordService) {
        this.wordService = wordService;
    }

    public TranslationService getTranslationService() {
        return translationService;
    }

    public void setTranslationService(TranslationService translationService) {
        this.translationService = translationService;
    }

    public UserService getUserService() {
        return userService;
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }
}