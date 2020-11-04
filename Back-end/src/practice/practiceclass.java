package practice;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandler;
import java.util.Scanner;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.*;

public class practiceclass {
	
	public static void main(String[] args) throws JsonGenerationException, JsonMappingException, IOException {
		String name;
		Scanner scan=new Scanner(System.in);
	
		System.out.println("This program will deliver temperature data of any city\n"
				+ "Please enter the city name:");
		name=scan.nextLine();
		scan.close();
		name=name.replace(' ', '+');
		ObjectMapper mapper=new ObjectMapper();
		HttpClient client=HttpClient.newHttpClient();
		String url= "http://api.openweathermap.org/data/2.5/weather?q="+name+"&appid=510ef3ed7c0eeb0f15b1247ece2b1f81&units=imperial";
		HttpRequest request=HttpRequest.newBuilder(
				URI.create(url))
				//.POST(HttpRequest.BodyPublishers.ofString("hello there"))
				.build();
		HttpResponse<String> response;
	try {
		response=client.send(request,HttpResponse.BodyHandlers.ofString());
		JsonNode node= mapper.readTree(response.body());
		System.out.println(node.get("main").get("temp"));

	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
		System.out.println("error");
	}
	
		
		
}}
