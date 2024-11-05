import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private authService: AuthService,
        private productService: ProductService
    ) { }

    async create(createOrderDto: CreateOrderDto, request: Request) {
        const product = (await this.productService.findOne(createOrderDto.product_id)).result.product
        const refNo = this.randomChar(3) + this.randomNumber(10)

        const BeforeCreateOrder = {
            product_id: product.id,
            user_id: request['id'],
            quantity: createOrderDto.quantity,
            amount: createOrderDto.quantity * product.price,
            ref_no: refNo
        }

        const BeforeUpdateProduct = {
            name: product.name,
            price: product.price,
            quantity: product.quantity - createOrderDto.quantity
        }

        let result = {}

        if(product.quantity <= 0){
            result = {
                status: false,
                message: 'สินค้าหมด'
            }
        } else if (product.quantity < createOrderDto.quantity) {
            result = {
                status: false,
                message: 'สินค้าไม่พอ เนื่องจากสินค้าคงเหลือ ' + `${product.quantity}` + ' ชิ้น'
            }
        } else {
            const toCreate = await this.orderRepository.create(BeforeCreateOrder)
            const orderSave = await this.orderRepository.save(toCreate)
            const updateProduct = await this.productService.update(product.id, BeforeUpdateProduct)
            result = {
                status: true,
                message: 'success',
                result: {
                    order: toCreate,
                    product: updateProduct['result'].product
                }
            }

        }
        
        return result;
    }

    async findAll() {
        const getOrder = await this.orderRepository.find()
        let result = {
            status: true,
            message: 'success',
            result: { orders: getOrder }
        }
        return result;
    }

    async findOne(id: number) {
        const getOrder = await this.orderRepository.findOneBy({id: id})
        const getProduct = await this.productService.findOne(getOrder.product_id)

        let result = {
            status: true,
            message: 'success',
            result: { 
                order: getOrder,
                product: getProduct.result.product

            }
        }
        return result;
    }

    async update(id: number, updateOrderDto: UpdateOrderDto, request: Request) {
        const getOrder = (await this.orderRepository.findOneBy({id: id}))
        const getProduct = (await this.productService.findOne(getOrder.product_id)).result.product

        let updateQuantity = 0

        if(getOrder.quantity < updateOrderDto.quantity){

            let quantityOrderUpdate = updateOrderDto.quantity - getOrder.quantity
            updateQuantity = getProduct.quantity - quantityOrderUpdate

        } else if (getOrder.quantity > updateOrderDto.quantity) {

            let quantityOrderUpdate = getOrder.quantity - updateOrderDto.quantity
            updateQuantity = getProduct.quantity + quantityOrderUpdate

        } else {
            updateQuantity = getProduct.quantity
        }

        const BeforeUpdateOrder = {
            product_id: getProduct.id,
            user_id: getOrder.user_id,
            quantity: updateOrderDto.quantity,
            amount: updateOrderDto.quantity * getProduct.price,
            ref_no: getOrder.ref_no
        }

        const BeforeUpdateProduct = {
            name: getProduct.name,
            price: getProduct.price,
            quantity: updateQuantity
        }

        let order = {
            ...getOrder,
            ...BeforeUpdateOrder
        }

        const toUpdateOrder = await this.orderRepository.save(order)
        const updateProduct = await this.productService.update(getProduct.id, BeforeUpdateProduct)

        let result = {
            status: true,
            message: 'success',
            result: {
                order: toUpdateOrder,
                product: updateProduct['result'].product
            }
        }
        return result;
    }

    async remove(id: number) {
        const getOrder = (await this.orderRepository.findOneBy({id: id}))
        const getProduct = (await this.productService.findOne(getOrder.product_id)).result.product

        const BeforeUpdateProduct = {
            name: getProduct.name,
            price: getProduct.price,
            quantity: getProduct.quantity + getOrder.quantity
        }

        const updateProduct = await this.productService.update(getProduct.id, BeforeUpdateProduct)
        const deletedOrder = await this.orderRepository.softDelete(id)

        let result = {
            status: true,
            message: 'success',
        }
        return result;
    }

    private randomNumber(length) {
        let result = '';
        // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const characters = '0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    private randomChar(length) {
        let result = '';
        // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
}
