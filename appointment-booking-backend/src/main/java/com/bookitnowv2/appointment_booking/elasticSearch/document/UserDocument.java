package com.bookitnowv2.appointment_booking.elasticSearch.document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

@AllArgsConstructor
@Getter
@Setter
@Document(indexName = "users")
public class UserDocument {

    @Id
    private Integer id;
    private String name;
    private String avatarUrl;
}
