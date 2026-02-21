package com.moveinsync.alertsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AlertsystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(AlertsystemApplication.class, args);
	}

}
