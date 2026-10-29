export const baseURL = import.meta.env.VITE_API_URL;

const SummaryApi = {
    register : {
        url : '/api/user/register',
        method : 'POST',
    }, 
    login : {
        url : '/api/user/login',
        method : 'POST',
    }, 
    forgot_password : {
        url : '/api/user/forgot-password',
        method : 'PUT',
    }, 
    verifyOtp : {
        url : '/api/user/verify-forgot-password-otp',
        method : 'PUT',
    },
    reset_password : {
        url : '/api/user/reset-password',
        method : 'PUT',
    }, 
    userDetails : {
        url : '/api/user/user-details', 
        method : 'get',
    }, 
    logout : {
        url : '/api/user/logout',
        method : 'get',
    }, 
    uploadAvatar : {
        url : '/api/user/upload-avatar',
        method : 'PUT',
    }, 
    updateUserDetails : {
        url : '/api/user/update-details',
        method : 'PUT', 
    }, 
    addCategory : {
        url : '/api/category/add-category',
        method : 'POST',
    }, 
    uploadImage : {
        url : '/api/file/upload',
        method : 'POST',
    }, 
    getCategory : {
        url : '/api/category/get-category',
        method : 'GET',
    }, 
    updateCategory : {
        url : '/api/category/update',
        method : 'PUT',
    }, 
    deleteCategory : {
        url : '/api/category/delete',
        method : 'DELETE',
    }, 
    createSubCategory : {
        url : '/api/subcategory/create',
        method : 'post'
    },
    getSubCategory : {
        url : '/api/subcategory/get',
        method : 'post'
    },
    updateSubCategory : {
        url : '/api/subcategory/update',
        method : 'put'
    },
    deleteSubCategory : {
        url : '/api/subcategory/delete',
        method : 'delete'
    }, 
    createProduct : {
        url : '/api/product/create',
        method : 'post'
    },
    getProduct : {
        url : '/api/product/get',
        method : 'post'
    },
    getProductByCategory : {
        url : '/api/product/get-product-by-category',
        method : 'post'
    },
    getProductByCategoryAndSubCategory : {
        url : '/api/product/get-pruduct-by-category-and-subcategory',
        method : 'post'
    },
    getProductDetails : {
        url : '/api/product/get-product-details',
        method : 'post'
    },
    updateProductDetails : {
        url : "/api/product/update-product-details",
        method : 'put'
    },
    deleteProduct : {
        url : "/api/product/delete-product",
        method : 'delete'
    },
    searchProduct : {
        url : '/api/product/search-product',
        method : 'post'
    },
    addTocart : {
        url : "/api/cart/create",
        method : 'post'
    },
    getCartItem : {
        url : '/api/cart/get',
        method : 'get'
    },
    updateCartItemQty : {
        url : '/api/cart/update-qty',
        method : 'put'
    },
    deleteCartItem : {
        url : '/api/cart/delete-cart-item',
        method : 'delete'
    },
    createAddress : {
        url : '/api/address/create',
        method : 'post'
    },
    getAddress : {
        url : '/api/address/get',
        method : 'get'
    },
    updateAddress : {
        url : '/api/address/update',
        method : 'put'
    },
    disableAddress : {
        url : '/api/address/disable',
        method : 'delete'
    },
    CashOnDeliveryOrder : {
        url : "/api/order/cash-on-delivery",
        method : 'post'
    },
    payment_url : {
        url : "/api/order/checkout",
        method : 'post'
    },
    getOrderItems : {
        url : '/api/order/order-list',
        method : 'get'
    },
    chat : {
        url : '/api/chat',
        method : 'post'
    }
}

export default SummaryApi