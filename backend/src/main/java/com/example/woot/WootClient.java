package com.example.woot;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/** Thin client for the Woot developer API with a small TTL cache to protect the 1000 req/day quota. */
@Component
public class WootClient {

    private record Cached(Instant expires, JsonNode value) {}

    private final RestClient rest;
    private final Duration ttl;
    private final Map<String, Cached> cache = new ConcurrentHashMap<>();

    public WootClient(WootProperties props) {
        this.rest = RestClient.builder()
                .baseUrl(props.baseUrl())
                .defaultHeader("x-api-key", props.apiKey() == null ? "" : props.apiKey())
                .build();
        this.ttl = Duration.ofSeconds(props.cacheSeconds());
    }

    public JsonNode getFeed(String feed, Integer page) {
        String key = "feed:" + feed + ":" + page;
        return cached(key, () -> rest.get()
                .uri(b -> {
                    var u = b.path("/feed/{feed}");
                    if (page != null) u.queryParam("page", page);
                    return u.build(feed);
                })
                .retrieve()
                .body(JsonNode.class));
    }

    public JsonNode getOffers(List<String> offerIds) {
        String key = "offers:" + String.join(",", offerIds);
        return cached(key, () -> rest.post()
                .uri("/getoffers")
                .contentType(MediaType.APPLICATION_JSON)
                .body(offerIds)
                .retrieve()
                .body(JsonNode.class));
    }

    private JsonNode cached(String key, Supplier<JsonNode> loader) {
        Cached c = cache.get(key);
        if (c != null && c.expires().isAfter(Instant.now())) return c.value();
        JsonNode value = loader.get();
        cache.put(key, new Cached(Instant.now().plus(ttl), value));
        return value;
    }
}
