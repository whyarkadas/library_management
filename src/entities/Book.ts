import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BorrowedBook } from "./BorrowedBook";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column("decimal", { precision: 4, scale: 2, default: 0 })
    averageRating!: number;

    @Column({ default: true })
    isAvailable!: boolean;

    @OneToMany(() => BorrowedBook, borrowedBook => borrowedBook.book)
    borrowedBooks!: BorrowedBook[];
} 