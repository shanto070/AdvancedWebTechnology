import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Products } from './entities/products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PartialUpdateProductDto } from './dto/partial-update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private repo: Repository<Products>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.repo.create(dto);
    await this.repo.save(product);
    return { message: 'Created', data: product };
  }

  async findAll() {
    const data = await this.repo.find({ order: { createdAt: 'DESC' } });
    return { message: 'All products', count: data.length, data };
  }

  async findOne(id: number) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return { message: 'Product found', data: product };
  }

  async update(id: number, dto: PartialUpdateProductDto) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    Object.assign(product, dto);
    await this.repo.save(product);

    return { message: 'Updated', data: product };
  }

  async replace(id: number, dto: UpdateProductDto) {
    const exists = await this.repo.findOne({ where: { id } });
    if (!exists) throw new NotFoundException('Product not found');

    const updated = this.repo.create({ id, ...dto });
    await this.repo.save(updated);

    return { message: 'Replaced', data: updated };
  }

  async remove(id: number) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    await this.repo.delete(id);
    return { message: 'Deleted', id };
  }

  async findByCategory(category: string) {
    const data = await this.repo.find({ where: { category } });
    return { message: 'By category', count: data.length, data };
  }

  async search(keyword: string) {
    const data = await this.repo.find({
      where: { name: ILike(`%${keyword}%`) },
    });
    return { message: 'Search result', count: data.length, data };
  }

  async toggleActive(id: number) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    product.isActive = !product.isActive;
    await this.repo.save(product);

    return { message: 'Toggled', data: product };
  }
}