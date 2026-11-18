package com.example.woot;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
@Validated
public class OffersController {

    private static final Set<String> FEEDS = Set.of("All", "Clearance", "Computers", "Electronics",
            "Featured", "Home", "Gourmet", "Shirts", "Sports", "Tools", "Wootoff");

    private final WootClient woot;

    public OffersController(WootClient woot) {
        this.woot = woot;
    }

    /** Feed of offers for a category (100 per page). */
    @GetMapping("/feed/{feed}")
    public JsonNode feed(@PathVariable String feed, @RequestParam(required = false) Integer page) {
        if (!FEEDS.contains(feed)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown feed: " + feed);
        }
        return woot.getFeed(feed, page);
    }

    /** Full details for up to 25 offers (proxy to Woot POST /getoffers). */
    @PostMapping("/offers")
    public JsonNode getOffers(@RequestBody @NotEmpty @Size(max = 25) List<String> offerIds) {
        return woot.getOffers(offerIds.stream().distinct().toList());
    }
}
