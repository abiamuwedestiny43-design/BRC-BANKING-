// app/api/transactions/export/route.ts (CSV Version)
import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import { toPlainObject } from "@/lib/serialization"
import { formatCurrency } from "@/lib/utils/banking"

export async function GET(request: NextRequest) {
  try {
    const userDoc = await getCurrentUser()
    if (!userDoc) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    const filters: any = {
      status: searchParams.get("status") || "all",
      type: searchParams.get("type") || "all",
      search: searchParams.get("search") || "",
    }

    await dbConnect()

    const matchStage: any = { userId: userDoc._id.toString() }

    // Apply filters
    if (filters.status && filters.status !== "all") {
      matchStage.txStatus = filters.status
    }
    
    if (filters.search) {
      matchStage.$or = [
        { txRef: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
        { "accountHolder": { $regex: filters.search, $options: "i" } }
      ]
    }

    // Use aggregation to fetch data with correct type
    const transfers = await Transfer.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "transfermetas",
          localField: "txRef",
          foreignField: "txRef",
          as: "meta"
        }
      },
      { $unwind: { path: "$meta", preserveNullAndEmptyArrays: true } },
      // Apply Type Filter if present (checking meta.txType)
      ...(filters.type && filters.type !== "all"
        ? [{ $match: { "meta.txType": filters.type } }]
        : []
      ),
      { $sort: { createdAt: -1 } }
    ])

    // Create CSV content with detailed "Receipt-like" columns
    // Headers
    let csvContent = "Date,Reference,Type,Description,Sender Name,Sender Account,Recipient Name,Recipient Bank,Recipient Account,Amount,Currency,Status\n";
    
    transfers.forEach(transaction => {
      const txType = transaction.meta?.txType || 'debit';
      const date = new Date(transaction.completedAt || transaction.createdAt).toLocaleString();
      
      // Values handling with CSV escaping
      const escape = (text: string | undefined | null) => {
        if (!text) return "";
        return `"${text.replace(/"/g, '""')}"`; // Escape double quotes
      }

      csvContent += `${escape(date)},`;
      csvContent += `${escape(transaction.txRef)},`;
      csvContent += `${escape(txType.toUpperCase())},`;
      csvContent += `${escape(transaction.description || "N/A")},`;
      
      // Sender Details
      csvContent += `${escape(transaction.senderName || userDoc.bankInfo?.bio?.firstname + " " + userDoc.bankInfo?.bio?.lastname)},`;
      csvContent += `${escape(transaction.senderAccount)},`;
      
      // Recipient Details
      csvContent += `${escape(transaction.accountHolder)},`;
      csvContent += `${escape(transaction.bankName)},`;
      csvContent += `${escape(transaction.accountNumber)},`;
      
      // Amount/Status
      csvContent += `${escape(formatCurrency(transaction.amount, transaction.currency))},`;
      csvContent += `${escape(transaction.currency)},`;
      csvContent += `${escape(transaction.txStatus)}\n`;
    });
    
    // Create a buffer from the CSV content
    const buffer = Buffer.from(csvContent, 'utf-8');
    
    // Create response
    const response = new NextResponse(buffer);
    response.headers.set('Content-Type', 'text/csv');
    response.headers.set('Content-Disposition', `attachment; filename="transactions-${new Date().toISOString().split('T')[0]}.csv"`);
    
    return response;
  } catch (error) {
    console.error("CSV export error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
