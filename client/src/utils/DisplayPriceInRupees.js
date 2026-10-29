export const DisplayPriceInRupees = (price)=>{
    return new Intl.NumberFormat('en-IN',{
        style : 'currency',
        currency : 'INR'
    }).format(price)
}

//Intl.NumberFormat is a built-in JavaScript constructor that formats numbers based on a given locale.
//'en-IN' → This sets the locale to Indian English (IN), ensuring the number uses Indian number formatting.

//style: 'currency' → Specifies that we want currency formatting instead of a plain number.
//currency: 'INR' → Sets the currency code to INR (Indian Rupee ₹).

//The .format(price) method converts the price into a formatted Indian Rupee string.