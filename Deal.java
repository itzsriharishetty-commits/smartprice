package com.smartprice.service;

public class Deal {
   private String store;
   private double price;
   private String note;
   private boolean available;

   public Deal(String store, double price, String note, boolean available) {
       this.store = store;
       this.price = price;
       this.note = note;
       this.available = available;
   }

   public String getStore()    { return store; }
   public double getPrice()    { return price; }
   public String getNote()     { return note; }
   public boolean isAvailable(){ return available; }

   @Override
   public String toString() {
       return String.format("%-12s Rs.%-8.2f %s%s",
               store, price, note, available ? "" : "  (Out of stock)");
   }
}
