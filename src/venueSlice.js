// Import the `createSlice` function from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Create a slice of the Redux store for handling venue-related state
export const venueSlice = createSlice({
  // Name of the slice
  name: "venue",
  
  // Initial state containing an array of venue objects
  initialState: [
    {
      img: "https://pixabay.com/images/download/chairs-2181916_640.jpg", // Image URL for the venue
      name: "Conference Room (Capacity:15)", // Name of the venue with capacity
      cost: 3500, // Cost to book the venue
      quantity: 0, // Quantity of this venue booked (default is 0)
    },
    {
      img: "https://pixabay.com/images/download/event-venue-1597531_640.jpg",
      name: "Auditorium Hall (Capacity:200)",
      cost: 5500,
      quantity: 0,
    },
    {
      img: "https://pixabay.com/images/download/convention-center-3908238_640.jpg",
      name: "Presentation Room (Capacity:50)",
      cost: 700,
      quantity: 0,
    },
    {
      img: "https://pixabay.com/images/download/chairs-2181916_640.jpg",
      name: "Large Meeting Room (Capacity:10)",
      cost: 900,
      quantity: 0,
    },
    {
      img: "https://pixabay.com/images/download/laptops-593296_640.jpg",
      name: "Small Meeting Room (Capacity:5)",
      cost: 1100,
      quantity: 0,
    },
  ],
  
  // Reducers to handle actions that modify the state
  reducers: {
    // Action to increment the quantity of a selected venue
    incrementQuantity: (state, action) => {
      const { payload: index } = action; // Extract the index of the venue from the action payload
      
      // Check if the venue exists at the given index
      if (state[index]) {
        // Special condition for "Auditorium Hall (Capacity:200)"
        // Do not allow more than 3 bookings for this venue
        if (state[index].name === " Auditorium Hall (Capacity:200)" && state[index].quantity >= 3) {
          return; // Exit without incrementing if the condition is met
        }
        state[index].quantity++; // Increment the quantity for the selected venue
      }
    },
    
    // Action to decrement the quantity of a selected venue
    decrementQuantity: (state, action) => {
      const { payload: index } = action; // Extract the index of the venue from the action payload
      
      // Check if the venue exists and its quantity is greater than 0
      if (state[index] && state[index].quantity > 0) {
        state[index].quantity--; // Decrement the quantity for the selected venue
      }
    },
  },
});

// Export the increment and decrement actions for use in components
export const { incrementQuantity, decrementQuantity } = venueSlice.actions;

// Export the venue slice reducer to be added to the store
export default venueSlice.reducer;
