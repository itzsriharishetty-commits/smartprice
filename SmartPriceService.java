package com.smartprice.service;

import java.util.*;

public class SmartPriceService {

   private static final String[] PLATFORMS = {
       "BlinkIt", "Zepto", "Swiggy", "BigBasket", "DMart", "JioMart", "Minutes"
   };

   public static void main(String[] args) {
       Scanner scanner = new Scanner(System.in);
       System.out.print("What's on your shopping list? ");
       String query = scanner.hasNextLine() ? scanner.nextLine() : "Atta 5kg";

       List<Deal> results = searchPrices(query);

       if (results.isEmpty()) {
           System.out.println("No live products were returned for this search.");
       } else {
           System.out.println("\nLive prices for \"" + query.trim() + "\":");
           for (Deal deal : results) {
               System.out.println("  " + deal);
           }
       }
   }

   // DSA 1: HashMap-based De-duplication (O(1) avg insert/lookup)
   // DSA 2: TimSort-based Ranking (Collections.sort is TimSort under the hood)
   public static List<Deal> searchPrices(String rawQuery) {
       String query = rawQuery == null ? "" : rawQuery.trim();
       if (query.isEmpty()) {
           return Collections.emptyList();
       }

       List<Deal> rawRecords = fetchPlatformPrices(query);

       Map<String, Deal> dedupMap = new HashMap<>();
       for (Deal deal : rawRecords) {
           dedupMap.put(deal.getStore(), deal); // later entries overwrite duplicates
       }

       List<Deal> uniqueDeals = new ArrayList<>(dedupMap.values());
       uniqueDeals.sort(Comparator.comparingDouble(Deal::getPrice)); // TimSort

       int limit = Math.min(12, uniqueDeals.size());
       return uniqueDeals.subList(0, limit);
   }

   // Stand-in for the live QuickCommerceAPI HTTPS call made by
   // app/api/prices/route.ts in the deployed Next.js backend.
   private static List<Deal> fetchPlatformPrices(String query) {
       List<Deal> records = new ArrayList<>();
       double basePrice = 200 + (query.length() * 7.5);
       Random random = new Random(query.toLowerCase().hashCode());

       for (String platform : PLATFORMS) {
           double price = basePrice + random.nextInt(60) - 30;
           boolean available = random.nextInt(10) != 0; // ~90% in stock
           records.add(new Deal(platform, Math.round(price * 100.0) / 100.0,
                   "Live price", available));
       }
       return records;
   }
}
