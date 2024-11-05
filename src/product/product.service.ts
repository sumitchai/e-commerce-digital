import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async create(createProductDto: CreateProductDto) {
        const createProduct = await this.productRepository.create(createProductDto)
        const toCreate = await this.productRepository.save(createProduct)
        let result = {
            status: true,
            message: 'success',
            product: toCreate
        }
        return result;
    }

    async findAll() {
        const getProduct = await this.productRepository.find({order: {id: 'DESC'}})
    
        let result = {
            status: true,
            message: 'success',
            result: {
                product: getProduct
            }
        }

        return result;
    }

    async findOne(id: number) {
        const product = await this.productRepository.findOneBy({id: id})

        let result = {
            status: true,
            message: 'success',
            result: {
                product: product
            }
        }
        
        return result;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {

        let result ={}

        let productsRepository = await this.productRepository.findOneBy({ id: id });
        
        let product = {
            ...productsRepository,
            ...updateProductDto
        }

        const toUpdate = await this.productRepository.save(product)

        result = {
            status: true,
            message: 'success',
            result: {
                product: toUpdate
            }
        }

        return result;
    }

    async remove(id: number) {
        const product = await this.productRepository.softDelete(id)

        let result = {
            status: true,
            message: 'success',
        }

        return result;
    }
}
