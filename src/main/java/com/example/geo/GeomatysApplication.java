package com.example.geo;

import com.example.geo.property.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;


@SpringBootApplication
@EnableConfigurationProperties({
        FileStorageProperties.class
})
public class GeomatysApplication {

	public static void main(String[] args) {
		SpringApplication.run(GeomatysApplication.class, args);
	}
}
