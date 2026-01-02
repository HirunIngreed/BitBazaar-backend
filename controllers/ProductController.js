import Product from "../models/Product.js";
import { isAdmin } from "./UserControllers.js";

export async function createProduct (req,res){

    try{
    
    if (!isAdmin(req)) {
        res.status(404).json(
            {
                message : "You can't add products"
            }
        )
        return
    }
    let productId
    const category = req.body.category
    const lastProduct = await Product.find({category : category}).sort({date : -1}).limit(1)


    if(category != "Other"){
        const firstLettersOfCategory = category.substring(0,3).toUpperCase()
        const firstLettersOfCategorySymb = firstLettersOfCategory + "-"
        
        

        if (lastProduct.length>0) {
            const lastProductId = lastProduct[0].productId.split("-")
            const incrementProductId = parseInt(lastProductId[1])
            const newProductIdNumber = incrementProductId + 1
            const newProductIdString = String(newProductIdNumber).padStart(6,"0")
            productId = firstLettersOfCategorySymb + newProductIdString
        }else{
            productId = firstLettersOfCategorySymb + "000001"
            
        }

    }else{
        productId = "PRD-000001"
        if (lastProduct.length > 0) {
            const lastProductIdOtherCate = lastProduct[0].productId.split("-")
            const lastProductIdNumberOtherCate = parseInt(lastProductIdOtherCate[1])
            const newProductIdNumber = lastProductIdNumberOtherCate + 1
            productId = lastProductIdOtherCate[0] + "-" + String(newProductIdNumber).padStart(6,"0")
        }
    }
 
    
    const product = new Product(
        {
            name : req.body.name,
            altNames : req.body.altNames,
            productId : productId,
            price : req.body.price,
            labeledPrice : req.body.labeledPrice,
            description : req.body.description,
            category : req.body.category,
            isAvailable : req.body.isAvailable,
            stock : req.body.stock,
            brand : req.body.brand,
            model : req.body.model,
            notes : req.body.notes,
            images : req.body.images

        }
    )
    const savedProduct = await product.save()
    res.json(
        {
            message : "Product is saved",
            product : savedProduct
        }
    )

    }catch(err){
        console.log(err)
    }
}

export async function retrieveProducts (req,res){
    try{
        if (isAdmin(req)) {
        const products = await Product.find() 
        res.json(
            {
                products : products
            }
        ) 
        }else{
            const products = await Product.find({isAvailable : true})
            res.json(
                {
                    products : products
                }
            )
        }
    }catch(error){
        res.status(500).json(
            {
                message : "Somthing went wrong",
                error : error
            }
        )
    }    
}

export async function retrieveProductById(req,res){
    try {
        const product = await Product.findOne({productId : req.params.productId})
        if (!product) {
            res.status(404).json(
                {
                    message : `Product with ${req.params.productId} is not found`
                }
            )
            return
        }
        res.json(
            {
                product : product
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                message : "Somthing went worng"
            }
        )
    }
}

export async function productUpdate(req,res){
    if (!isAdmin(req)) {
        res.status(404).json(
            {
                message : "You can't update product"
            }
        )
        return
    }

    try{
        await Product.updateOne({productId : req.params.productId},
            req.body)
        res.json(
            {
                message : "Product is updated"
            }
        )

    }catch(error){
        res.status(500).json(
            {
                message : "Somthing went worng"
            }
        )
        return
    }
}

export async function deleteProduct(req,res){

    if (req.user.role == "admin") {
        try{
        await Product.deleteOne({productId : req.params.productId})
        res.json(
            {
                message : "Product deleted successfull"
            }
        )
        }catch(error){
            res.status(500).json(
                {
                    message : "Somthing went worng"
                }
            )
        }
    }else{
        res.status(404).json(
            {
                message : "You need admin acsess to compleate this function"
            }
        )
    }

    
}

export async function retrieveProductsByCategory(req,res){
    try{
    const sameCategoryProducts = await Product.find({category : req.params.category})
    res.json(
        {
            products : sameCategoryProducts
        }
    )

    }catch(err){
        res.status(500).json(
            {
                error : err
            }
        )
    }

}

export async function searchProduct(req,res){
    const query = req.params.query

    try {
        const products = await Product.find(
           {$or : [
                {name : { $regex : query , $options : "i"}},
                {altNames : {$elemMatch : { $regex : query , $options : "i"}}}
                ],
                isAvailable : true                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
            }
        )
    
        res.json(
            {
                products : products
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                message : "Products not found"
            }
        )
    }
} 