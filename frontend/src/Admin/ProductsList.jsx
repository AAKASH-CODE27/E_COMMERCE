import React, { useEffect } from 'react'
import '../AdminStyles/ProductsList.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import PageTitle from '../components/PageTitle'
import { fetchAdminProducts, removeErrors } from '../features/admin/adminSlice'
import { Link } from 'react-router-dom'
import { Delete, Edit } from '@mui/icons-material'

function ProductsList() {
 
    const {products, loading, error} = useSelector(state => state.admin)
    const  dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAdminProducts())
    },[dispatch])

    useEffect(() => {
        if(error){
            toast.error(error,{position:'top-center',autoClose:3000})
            dispatch(removeErrors())
        }
    },[dispatch, error])

    if(!products || products.length === 0){
        return (
            <div className = "product-list-container">
                <h1 className = "product-list-title"> Admin Product</h1>
                <p className="no-admin-product">
                    No Product Found
                </p>
            </div>
        )
    }
  return (
    <>
    {loading ? (<Loader/>):(
    <>
    <Navbar/>
    <PageTitle title = "All Products" />

    <div className = "product-list-container">
        <h1 className = "product-list-title">
        All Products
        </h1>

        <table className = "product-table">
            <thead>
                <tr>
                    <th>Sl no</th>
                    <th>Porduct Image</th>
                    <th>Prooduct Name</th>
                    <th>Price</th>
                    <th>Ratings</th>
                    <th>Category</th>
                    <th>Stick</th>
                    <th>Created At</th>
                    <th>Actions</th>

                </tr>
            </thead>

            <tbody>
                   {products.map((product,index) => (
                    <tr key = {product._id}>
                        <td> {index + 1}</td>
                        <td> <img src = {products.image} alt = "Name" /></td>
                        <td>{product.name}</td>
                        <td>{product.price}/-</td>
                        <td>{product.ratings}</td>
                        <td>{product.category}</td>
                        <td>{product.stock}</td>

                        <td>{new Date(products.createAt).toLocaleString()}</td>
                        <td>
                            <Link to = {`/admin/product/${product._id}`}
                            className = 'action-icon edit-icon'> <Edit/>
                            </Link>

                            <Link to = {`/admin/product/${product._id}`}
                            className = 'action-icon delete-icon'> <Delete/>
                            </Link>

                        </td>
                    </tr>
                    ))}
            </tbody>
        </table>
    </div>
    <Footer />
    </>)}
    </>
  )
}

export default ProductsList
