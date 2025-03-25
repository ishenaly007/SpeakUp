package com.abit8.speakupengbot;

import com.abit8.speakupengbot.bot.SpeakUpEngBot;
import com.abit8.speakupengbot.db.service.WordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

@SpringBootApplication
public class SpeakUpEngBotApplication implements CommandLineRunner {

    @Autowired
    private SpeakUpEngBot telegramBot;

    @Autowired
    private WordService wordService;

    @Override
    public void run(String... args) throws Exception {
        TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
        botsApi.registerBot(telegramBot);
        //wordService.loadWordsFromFile();
    }

    public static void main(String[] args) {
        SpringApplication.run(SpeakUpEngBotApplication.class, args);
    }
}