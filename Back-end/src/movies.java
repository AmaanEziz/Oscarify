import java.io.*;
import java.util.ArrayList;
import java.util.Scanner;
import java.lang.String;
import javax.json.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.JSONWrappedObject;
import com.fasterxml.jackson.jr.ob.impl.JSONReader;

import org.apache.commons.io.IOUtils;
import org.json.simple.*;
import org.json.simple.parser.*;
public class movies{
	public static void main(String[] args)throws IOException, JsonProcessingException, ParseException {
	 FileReader database=new FileReader("C:\\Users\\amaan\\Downloads\\data.json");
	 JSONParser parser=new JSONParser();
	 JSONArray a = (JSONArray) parser.parse(database);
    System.out.println("Pick any Oscar category for a movie and this app"
    		+ "will list all movies that've won the category");
    Scanner scan=new Scanner(System.in);
    String award=scan.nextLine();
    int sum=0;
    for (Object object: a) {
    	String data=object.toString();
    	if(data.contains(award)&&data.contains("true")){System.out.println(object);}
    	sum++;
    }
    System.out.println(sum);
	}
}
