import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = () => {

    const url = "http://localhost:5137"
    const [image,setImage] = useState(false);
    const [data,setData] = useState({
        name: "",
        description: "",
        category: "Salad",
        price: "",
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data=> ({...data,[name]:value}))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('image',image);
        formData.append('name',data.name);
        formData.append('description',data.description);
        formData.append('category',data.category);
        formData.append('price',Number(data.price));

        const response = await axios.post("http://localhost:5137/api/food/add",formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        if (response.data.success) {
            alert("Food added successfully")
            setImage(false)
            setData({
                name: "",
                description: "",
                category: "Salad",
                price: "",
            })
            toast.success(response.data.message)
        } else {
            toast.error(response.data.message)
        }
    }

  return (
    <div className='add'>
        <form className='flex-col' onSubmit={onSubmitHandler}>
            <div className='add-img-upload flex-col'>
                <p>Upload Image</p>
                <label htmlFor='image'>
                    <img src={image?URL.createObjectURL(image):assets.upload_area} alt='' />
                </label>
                <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required />
            </div>
            <div className='add-product-name flex-col'>
                <p>Product name</p>
                <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
            </div>
            <div className='add-product-description flex-col'>
                <p>Product description</p>
                <textarea onChange={onChangeHandler} value={data.description} name='description' rows="6" placeholder='Write content here'  required/>
            </div>
            <div className="add-category-price">
                <div className="add-category flex-col">
                    <p>Product category</p>
                    <select onChange={onChangeHandler} name="category">
                        <option value="Salad">Salad</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Deserts">Deserts</option>
                        <option value="Sandwich">Sandwich</option>
                        <option value="Cake">Cake</option>
                        <option value="Veg">Veg</option>
                        <option value="Pasta">Past</option>
                        <option value="Noodle">Noodle</option>
                    </select>
                </div>
                <div className="add-price flex-col">
                    <p>product price</p>
                    <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='$20'/>
                </div>
            </div>
            <button type='submit' className='add-btn'>ADD</button>
        </form>
    </div>
  )
}

export default Add