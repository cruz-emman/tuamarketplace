import { publicRequest, userRequest } from "../publicRequest"
import { loginFailure, loginStart, loginSuccess, registerFailure, registerStart, registerSuccess, updateStart, updateFailure, updateSuccess, resetState } from "./authSlice"
import { addProductFailure, addProductStart, addProductSuccess, deleteProductFailure, deleteProductStart, deleteProductSuccess } from "./productSlice"


//AUTH SECTIOn
export const registerUser = async (user, dispatch) => {
    dispatch(registerStart())
  
    try {
      const res = await publicRequest.post('/auth/register', user)
      dispatch(registerSuccess(res.data))
    } catch (error) {
      dispatch(registerFailure())
    }

  }

  export const loginUser = async (user, dispatch) => {
    dispatch(loginStart());
    try {
      const res = await publicRequest.post("/auth/login", user);
      dispatch(loginSuccess(res.data));
    } catch (err) {
      dispatch(loginFailure());
    }
  };

  export const logoutUser = async (dispatch) =>{
    localStorage.removeItem('user')
  }




//USER SECTION
export const updateUser = async (id, user, dispatch) =>{
  dispatch(updateStart())

  try {
    const res = await userRequest.put(`/users/${id}`, user)
    dispatch(updateSuccess(res.data))
    dispatch(resetState())
  } catch (error) {
    dispatch(updateFailure())
  }
}




///PRODUCT SECTION 

  export const addProduct = async (product, dispatch) => {
    dispatch(addProductStart())

    try {
        const res = await userRequest.post('/products/',product)
        dispatch(addProductSuccess(res.data))
    } catch (error) {
        dispatch(addProductFailure())
    }
}

export const deleteProduct = async (id, dispatch) => {
  dispatch(deleteProductStart());
  try {
    const res = await userRequest.delete(`/products/${id}`);
    dispatch(deleteProductSuccess(id));
  } catch (err) {
    dispatch(deleteProductFailure());
  }
};

