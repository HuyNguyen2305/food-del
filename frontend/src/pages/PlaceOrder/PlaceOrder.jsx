import React, { useContext, useState } from 'react'
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';

const PlaceOrder = () => {

  const {getTotalCartAmount, token, food_list, cartItems, url} = useContext(StoreContext);

  const [data, setData] = React.useState({
    firstName:"",
    lastName:"",
    email:"",
    address:"",
    city:"",
    province:"",
    phone:"",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]: value}));
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item)=>{
      if (cartItems[item._id]>0){
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    console.log(orderItems);
  }

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
              <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
              <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
          </div>
          <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
          <input required name="address" onChange={onChangeHandler} value={data.address} type="text" placeholder='Address' />
          <div className="multi-fields">
              <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
              <input required name='province' onChange={onChangeHandler} value={data.province} type="text" placeholder='Province' />
          </div>
          <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone number' />
      </div>
      <div className="place-order-right">
      <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
                <b>Total</b>
                <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder