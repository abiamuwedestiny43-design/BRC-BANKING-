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

    const user = toPlainObject(userDoc)
    const { searchParams } = new URL(request.url)
    
    const filters: any = {
      status: searchParams.get("status") || "all",
      type: searchParams.get("type") || "all",
      search: searchParams.get("search") || "",
    }

    await dbConnect()

    const query: any = { userId: user._id.toString() }

    // Apply filters
    if (filters.status && filters.status !== "all") {
      query.txStatus = filters.status
    }
    
    if (filters.type && filters.type !== "all") {
      query.txType = filters.type
    }
    
    if (filters.search) {
      query.$or = [
        { txRef: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
        { "accountHolder": { $regex: filters.search, $options: "i" } }
      ]
    }

    const transfers = await Transfer.find(query)
      .sort({ createdAt: -1 })
      .lean()

    // Create CSV content
    let csvContent = "Date,Reference,Description,Recipient,Amount,Status\n";
    
    transfers.forEach(transaction => {
      csvContent += `"${new Date(transaction.createdAt).toLocaleDateString()}",`;
      csvContent += `"${transaction.txRef}",`;
      csvContent += `"${transaction.description || "N/A"}",`;
      csvContent += `"${transaction.accountHolder}",`;
      csvContent += `"${formatCurrency(transaction.amount, transaction.currency)}",`;
      csvContent += `"${transaction.txStatus}"\n`;
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
