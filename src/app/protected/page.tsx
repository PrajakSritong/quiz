"use client";

import Link from "next/link";
import axios from "axios";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface transactionsType {
    _id: string;
    amount: number;
    date: string;
    note: string;
    type: "income" | "expense";
}

function formatDate(input: string): string {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

const ProtectedPage = () => {
    const { data: session } = useSession();
    const [transactions, setTransactions] = useState<transactionsType[]>([]);

    const fetchTransactions = async () => {
        if (session?.user?.id) {
            try {
                const response = await axios.get(
                    `/api/transactions/${session.user.id}`
                );
                setTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        }
    };

    const deleteTransaction = async (id: string) => {
        if (confirm("comfirm to delete")) {
            try {
                const res = await axios.delete(`/api/transactions/${id}`);

                if (res.status === 200) {
                    setTransactions(
                        transactions.filter((transaction) => transaction._id !== id)
                    );
                } else {
                    console.log(`Failed to delete transaction: ${res.status}`);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [session]);

    if (!session) {
        return (
            <div>
                <p>Please login</p>
                <Link className="underline text-blue-600" href="/login">
                    Login
                </Link>
            </div>
        );
    } else {
        return (
            <div>
                <h1 className="text-3xl text-center">Protected Page</h1>
                <p className="mb-5">ยินดีต้อนรับ คุณ  {session.user?.email}!</p>

                <Link
                    href="/protected/create"
                    className="bg-green-500 px-5 py-2.5 rounded text-white mt-3 mr-2"
                >
                    Add Transection
                </Link>
                <div className="mt-12 mb-4 ">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-3xl font-semibold mb-5 text-green-700">รายรับ</h2>
                            <ul className="space-y-4">
                                {transactions
                                    .filter((transaction) => transaction.type === "income")
                                    .map((transaction) => (
                                        <li key={transaction._id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                            <p className="text-green-600 text-lg font-semibold">Amount: {transaction.amount}</p>
                                            <p className="text-gray-600">Date: {formatDate(transaction.date)}</p>
                                            <p className="text-gray-600">Note: {transaction.note}</p>
                                            <div className="space-x-4 mt-2">
                                                <Link
                                                    className="text-yellow-500 hover:text-yellow-600 underline"
                                                    href={`/protected/edit/${transaction._id}`}
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => deleteTransaction(transaction._id)}
                                                    className="text-red-600 hover:text-red-700 underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                            <p className="font-bold mt-6 text-lg text-green-800">
                                Total Income:{" "}
                                {transactions
                                    .filter((transaction) => transaction.type === "income")
                                    .reduce((total, transaction) => total + transaction.amount, 0)}
                            </p>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-3xl font-semibold mb-5 text-red-700">รายจ่าย</h2>
                            <ul className="space-y-4">
                                {transactions
                                    .filter((transaction) => transaction.type === "expense")
                                    .map((transaction) => (
                                        <li key={transaction._id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                            <p className="text-red-600 text-lg font-semibold">Amount: {transaction.amount}</p>
                                            <p className="text-gray-600">Date: {formatDate(transaction.date)}</p>
                                            <p className="text-gray-600">Note: {transaction.note}</p>
                                            <div className="space-x-4 mt-2">
                                                <Link
                                                    className="text-yellow-500 hover:text-yellow-600 underline"
                                                    href={`/protected/edit/${transaction._id}`}
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => deleteTransaction(transaction._id)}
                                                    className="text-red-600 hover:text-red-700 underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                            <p className="font-bold mt-6 text-lg text-red-800">
                                Total Expense:{" "}
                                {transactions
                                    .filter((transaction) => transaction.type === "expense")
                                    .reduce((total, transaction) => total + transaction.amount, 0)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-16 text-center">
                    <h2 className="font-bold">
                        Show chart of income and expenses for month 2 onwards.
                    </h2>
                    <IncomeExpenseChart transactions={transactions} />
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>
        );
    }
};

export default ProtectedPage;