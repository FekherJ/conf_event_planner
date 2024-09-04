// Import necessary libraries and components
import React, { useState } from "react";
import "./ConferenceEvent.css"; // Import the CSS file for styling
import TotalCost from "./TotalCost"; // Import the TotalCost component
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks for state management
import { incrementQuantity, decrementQuantity } from "./venueSlice"; // Import actions from the venueSlice
import { toggleMealSelection } from "./mealsSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";






// Main component for handling the conference event planning
const ConferenceEvent = () => {
    // State to toggle the visibility of items
    const [showItems, setShowItems] = useState(false);
    
    // State to track the number of people attending (default is 1)
    const [numberOfPeople, setNumberOfPeople] = useState(1);


    
    // Retrieve the venue items from the Redux store
    const venueItems = useSelector((state) => state.venue); //venue is the name of the slice
    const avItems = useSelector((state) => state.av);
    const mealItems = useSelector((state) => state.meals);

    
    // Get the dispatch function to send actions to the Redux store
    const dispatch = useDispatch();
    
    
    
    // Calculate how many more times the "Auditorium Hall" can be booked (max 3 times)
    const remainingAuditoriumQuantity = 3 - venueItems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity;



    // Function to toggle the visibility of the items
    const handleToggleItems = () => {
        console.log("handleToggleItems called"); // Log for debugging purposes
        setShowItems(!showItems); // Toggle the `showItems` state
    };



    // Function to handle adding a venue to the cart
    const handleAddToCart = (index) => {
        // Check if the selected item is "Auditorium Hall" and if it has already been booked 3 times
        if (venueItems[index].name === "Auditorium Hall (Capacity:200)" && venueItems[index].quantity >= 3) {
          return; // Do nothing if the limit is reached
        }
        dispatch(incrementQuantity(index)); // Dispatch action to increment the quantity
      };
    
    // Function to handle removing a venue from the cart
    const handleRemoveFromCart = (index) => {
        // Check if the quantity is greater than 0 before decrementing
        if (venueItems[index].quantity > 0) {
          dispatch(decrementQuantity(index)); // Dispatch action to decrement the quantity
        }
      };

   



    // Placeholder function for incrementing AV quantity (not yet implemented)
    const handleIncrementAvQuantity = (index) => {
      dispatch(incrementAvQuantity(index));
    };

    // Placeholder function for decrementing AV quantity (not yet implemented)
    const handleDecrementAvQuantity = (index) => {
      dispatch(decrementAvQuantity(index));
    };

    // Placeholder function for handling meal selection (not yet implemented)
    const handleMealSelection = (index) => {
      const item = mealItems[index];
      if (item.selected && item.type === "mealForPeaople"){
        // Ensure numberOfPeople is set before toggling selection
        const newNumberOfPeople = item.selected ? numberOfPeople : 0; // update the numberOfPeople state variable
        dispatch(toggleMealSelection(index, newNumberOfPeople));  // toggling the selection
      }
      else {  //  item of type mealForPeople not selected
        dispatch(toggleMealSelection(index));
      }

       
    };

    // Placeholder function to retrieve items from the TotalCost component (not yet implemented)
    const getItemsFromTotalCost = () => {
      const items = [];
      venueItems.forEach((item) => {
        if (item.quantity > 0) {
          items.push({ ...item, type: "venue" });
        }
      });
      avItems.forEach((item) => {
        if (
          item.quantity > 0 &&
          !items.some((i) => i.name === item.name && i.type === "av")
        ) {
          items.push({ ...item, type: "av" });
        }
      });
      mealItems.forEach((item) => {
        if (item.selected) {
          const itemForDisplay = { ...item, type: "meals" };
          if (item.numberOfPeople) {
            itemForDisplay.numberOfPeople = numberOfPeople;
          }
          items.push(itemForDisplay);
        }
      });
      return items;
    };
  

    // Get items from the TotalCost component (currently empty)
    const items = getItemsFromTotalCost();

    // Placeholder component for displaying items (not yet implemented)
    const ItemsDisplay = ({ items }) => {
      console.log(items);
      return <>
          <div className="display_box1">
              {items.length === 0 && <p>No items selected</p>}
              <table className="table_item_data">
                  <thead>
                      <tr>
                          <th>Name</th>
                          <th>Unit Cost</th>
                          <th>Quantity</th>
                          <th>Subtotal</th>
                      </tr>
                  </thead>
                  <tbody>
                      {items.map((item, index) => (
                          <tr key={index}>
                              <td>{item.name}</td>
                              <td>${item.cost}</td>
                              <td>
                                  {item.type === "meals" || item.numberOfPeople
                                  ? ` For ${numberOfPeople} people`
                                  : item.quantity}
                              </td>
                              <td>{item.type === "meals" || item.numberOfPeople
                                  ? `${item.cost * numberOfPeople}`
                                  : `${item.cost * item.quantity}`}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </>
    };

    // Function to calculate the total cost of the selected items
    const calculateTotalCost = (section) => {
        let totalCost = 0;
        if (section === "venue") {
            venueItems.forEach((item) => {
            totalCost += item.cost * item.quantity; // Multiply item cost by quantity and add to total cost
          });
        } else if (section === "av") {
              avItems.forEach((item) => {
              totalCost += item.cost * item.quantity;
            });
        } else if (section === "meals") {
            mealsItems.forEach((item) => {
              if (item.selected) {
                totalCost += item.cost * numberOfPeople;
              }
            });
        
        // object named totalCosts which includes all three subtotals in the total cost.
        const totalCosts = {
              venue: venueTotalCost,
              av: avTotalCost,
              meals: mealsTotalCost,
        };

        return totalCost; // Return the calculated total cost
      };




    
    // Calculate the total cost for the venue section
    const venueTotalCost = calculateTotalCost("venue");
    const avTotalCost = calculateTotalCost("av");
    const mealsTotalCost = calculateTotalCost("meals");



    // Function to handle navigation to different sections (e.g., Venue, Add-ons, Meals)
    const navigateToProducts = (idType) => {
        if (idType === '#venue' || idType === '#addons' || idType === '#meals') {
          // If a section link is clicked, ensure the items are shown
          if (!showItems) { // Check if items are currently hidden
            setShowItems(true); // Show items if they are hidden
          }
        }
      }


    // JSX (React's syntax for UI) to render the component
    return (
        <>
            {/* Navbar section with links to different sections */}
            <navbar className="navbar_event_conference">
                <div className="company_logo">Conference Expense Planner</div>
                <div className="left_navbar">
                    <div className="nav_links">
                        <a href="#venue" onClick={() => navigateToProducts("#venue")} >Venue</a>
                        <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
                        <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
                    </div>
                    <button className="details_button" onClick={() => setShowItems(!showItems)}>
                        Show Details
                    </button>
                </div>
            </navbar>

            {/* Main content container */}
            <div className="main_container">
                {/* Conditional rendering based on `showItems` state */}
                {!showItems ? (
                    <div className="items-information">
                        {/* Venue selection section */}
                        <div id="venue" className="venue_container container_main">
                            <div className="text">
                                <h1>Venue Room Selection</h1>
                            </div>
                            <div className="venue_selection">
                                {/* Loop through each venue item and display its information */}
                                {venueItems.map((item, index) => (
                                    <div className="venue_main" key={index}>
                                        <div className="img">
                                            <img src={item.img} alt={item.name} />
                                        </div>
                                        <div className="text">{item.name}</div>
                                        <div>${item.cost}</div>
                                        <div className="button_container">
                                            {/* Conditional rendering for Auditorium Hall */}
                                            {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (
                                                <>
                                                    <button
                                                        className={venueItems[index].quantity === 0 ? "btn-warning btn-disabled" : "btn-minus btn-warning"}
                                                        onClick={() => handleRemoveFromCart(index)}
                                                    >
                                                        &#8211;
                                                    </button>
                                                    <span className="selected_count">
                                                        {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
                                                    </span>
                                                    <button
                                                        className={remainingAuditoriumQuantity === 0 ? "btn-success btn-disabled" : "btn-success btn-plus"}
                                                        onClick={() => handleAddToCart(index)}
                                                    >
                                                        &#43;
                                                    </button>
                                                </>
                                            ) : (
                                                // Rendering for other venue items
                                                <div className="button_container">
                                                    <button
                                                        className={venueItems[index].quantity === 0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
                                                        onClick={() => handleRemoveFromCart(index)}
                                                    >
                                                        &#8211;
                                                    </button>
                                                    <span className="selected_count">
                                                        {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
                                                    </span>
                                                    <button
                                                        className={venueItems[index].quantity === 10 ? " btn-success btn-disabled" : "btn-success btn-plus"}
                                                        onClick={() => handleAddToCart(index)}
                                                    >
                                                        &#43;
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="total_cost">Total Cost: ${venueTotalCost}</div>
                        </div>

                        {/* Add-ons section (currently empty) */}
                        <div id="addons" className="venue_container container_main">
                            <div className="text">
                                <h1>Add-ons Selection</h1>
                            </div>
                            <div className="addons_selection">
                                {/* Add-on items will be displayed here */}
                                
                                {avItems.map((item, index) => (
                                  <div className="av_data venue_main" key={index}>
                                    <div className="img"> <img src={item.img} alt={item.name} /></div>
                                    <div className="text"> {item.name} </div>
                                    <div> ${item.cost} </div>
                                    <div className="addons_btn">
                                      <button className="btn-warning" onClick={() => handleDecrementAvQuantity(index)}> &ndash; </button>
                                      <span className="quantity-value">{item.quantity}</span>
                                      <button className=" btn-success" onClick={() => handleIncrementAvQuantity(index)}> &#43; </button>
                                    </div>
                                  </div>
                                 ))}
                            </div>
                            <div className="total_cost">Total Cost: {avTotalCost}</div>
                        </div>

                        {/* Meals section (currently empty) */}
                        <div id="meals" className="venue_container container_main">
                            <div className="text">
                                <h1>Meals Selection</h1>
                            </div>
                            <div className="input-container venue_selection">
                                {/* Meal selection inputs will be displayed here */}
                                <label htmlFor="numberOfPeople"><h3>Number of People:</h3></label>
                                <input type="number" className="input_box5" id="numberOfPeople" value={numberOfPeople}
                                onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                                min="1"/>
                            </div>
                            
                            <div className="meal_selection">
                                {/* Meal items will be displayed here */}
                                {mealsItems.map((item, index) => (
                                <div className="meal_item" key={index} style={{ padding: 15 }}>
                                  <div className="inner">
                                    <input type="checkbox" id={ `meal_${index}` }
                                    checked={ item.selected }
                                    onChange={() => handleMealSelection(index)}/>
                                    <label htmlFor={`meal_${index}`}> {item.name} </label>
                                  </div>
                                  <div className="meal_cost">${item.cost}</div>
                                </div>
                                ))}
                            </div>
                            <div className="total_cost">Total Cost: {mealsTotalCost} </div>
                        </div>
                    </div>
                ) : (
                    // Detailed view when `showItems` is true
                    <div className="total_amount_detail">
                        <TotalCost 
                            totalCosts={totalCosts} 
                            handleClick={handleToggleItems} 
                            ItemsDisplay={() => <ItemsDisplay items={items} />} 
                        />
                    </div>
                )}
            </div>
        </>
    );
};
};

// Export the component so it can be used in other parts of the application
export default ConferenceEvent;
