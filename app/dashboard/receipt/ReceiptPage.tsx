// app/dashboard/receipt/[txRef]/ReceiptPage.tsx
"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Download,
  ArrowLeft,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  Banknote,
  User,
  Building,
  Hash,
  Globe,
  Info,
} from "lucide-react"
import Link from "next/link"

interface ReceiptPageProps {
  transfer: {
    txRef: string
    txDate: string
    amount: number
    currency: string
    txCharge: number
    txStatus: string
    bankHolder: string
    bankName: string
    bankAccount: string
    txRegion: string
    txReason?: string
  }
}

export default function ReceiptPage({ transfer }: ReceiptPageProps) {
  const formatCurrency = (value: number, currency = "USD") =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
      value
    )

  const handleDownload = async () => {
    try {
      const { jsPDF } = await import("jspdf")

      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" })
      const margin = 10
      const pageWidth = 210
      const pageHeight = 297
      const usableWidth = pageWidth - margin * 2
      const footerHeight = 35
      let y = 18

      const colors = {
        primary: [34, 139, 34],
        secondary: [59, 130, 246],
        success: [16, 185, 129],
        text: [31, 41, 55],
        textMuted: [107, 114, 128],
        textLight: [156, 163, 175],
        border: [229, 231, 235],
      }

      // HEADER
      doc.setFillColor(...colors.primary)
      doc.rect(0, 0, pageWidth, 28, "F")

      doc.setFont("helvetica", "bold")
      doc.setFontSize(18) // bigger bank name
      doc.setTextColor(255, 255, 255)
      doc.text("Corporate Bank", margin, 14)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10) // bigger subtitle
      doc.setTextColor(220, 255, 220)
      doc.text("Secure Money Transfer Service", margin, 22)

      // STATUS
      doc.setFillColor(...colors.success)
      doc.roundedRect(pageWidth - margin - 35, 9, 32, 10, 2, 2, "F")
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor(255, 255, 255)
      doc.text(" COMPLETED", pageWidth - margin - 33, 16)

      y = 60

      // RECEIPT TITLE
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.setTextColor(...colors.text)
      doc.text("Transaction Receipt", margin, y)
      y += 8

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(...colors.textMuted)
      doc.text(`Ref: ${transfer.txRef}`, margin, y)
      doc.text(
        transfer.txDate ? new Date(transfer.txDate).toLocaleString() : "",
        pageWidth - margin,
        y,
        { align: "right" }
      )
      y += 12

      // AMOUNT BOX
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(margin, y, usableWidth, 25, 3, 3, "F")
      doc.setDrawColor(...colors.border)
      doc.roundedRect(margin, y, usableWidth, 25, 3, 3, "S")

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(...colors.textMuted)
      doc.text("Amount", margin + 5, y + 8)

      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.setTextColor(...colors.success)
      doc.text(formatCurrency(transfer.amount, transfer.currency), margin + 5, y + 18)

      y += 30

      // DETAILS
      const addDetailRow = (label: string, value: string, yPos: number, isLast = false) => {
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(...colors.textMuted)
        doc.text(label, margin + 5, yPos)

        doc.setFont("helvetica", "bold")
        doc.setFontSize(9)
        doc.setTextColor(...colors.text)
        doc.text(value, pageWidth - margin - 5, yPos, { align: "right" })

        if (!isLast) {
          doc.setDrawColor(...colors.border)
          doc.setLineWidth(0.3)
          doc.line(margin + 5, yPos + 2, pageWidth - margin - 5, yPos + 2)
        }
      }

      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text("Transaction Details", margin, y)
      y += 8

      addDetailRow("Transfer Amount:", formatCurrency(transfer.amount, transfer.currency), y)
      y += 8
      addDetailRow("Service Fee:", formatCurrency(transfer.txCharge, transfer.currency), y)
      y += 8
      addDetailRow(
        "Total Debited:",
        formatCurrency((transfer.amount || 0) + (transfer.txCharge || 0), transfer.currency),
        y,
        true
      )
      y += 14

      // RECIPIENT
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text("Recipient Info", margin, y)
      y += 8

      addDetailRow("Account Holder:", transfer.bankHolder || "N/A", y)
      y += 8
      addDetailRow("Bank Name:", transfer.bankName || "N/A", y)
      y += 8
      addDetailRow("Account Number:", transfer.bankAccount || "N/A", y)
      y += 8
      addDetailRow("Transfer Type:", transfer.txRegion || "N/A", y, true)
      y += 14

      // DESCRIPTION
      if (transfer.txReason) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.text("Description", margin, y)
        y += 8
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        const descLines = doc.splitTextToSize(transfer.txReason, usableWidth - 10)
        doc.text(descLines, margin + 5, y)
        y += descLines.length * 2 + 6
      }

      // === FOOTER (expanded, no extra gap) ===
      const footerY = pageHeight - footerHeight + 8

      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      doc.setTextColor(...colors.textLight)
      doc.text("Thank you for choosing Corporate Bank", pageWidth / 2, footerY, { align: "center" })

      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      doc.text("Contact: support@Corporatebank.com | +1 (800) 123-4567", pageWidth / 2, footerY + 6, { align: "center" })
      doc.text("www.Corporatebank.com | Secure • Trusted • Reliable", pageWidth / 2, footerY + 12, { align: "center" })

      doc.setFontSize(10)
      doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 18, { align: "center" })

      // WATERMARK
      doc.setFontSize(30)
      doc.setTextColor(200, 200, 200)
      doc.text("Corporate Bank RECEIPT", pageWidth / 2, pageHeight / 2, {
        align: "center",
        angle: 45,
      })

      const timestamp = new Date().toISOString().slice(0, 10)
      doc.save(`Corporatebank-Receipt-${transfer.txRef}-${timestamp}.pdf`)
    } catch (err) {
      console.error("PDF generation error:", err)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Transfer Receipt
            </CardTitle>
            <CardDescription className="text-green-700 font-medium">
              Transaction completed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Transaction Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <FileText className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-muted-foreground">Reference</p>
                  <p className="font-mono font-medium">{transfer.txRef}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <Calendar className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {new Date(transfer.txDate).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-bold text-lg text-green-700">
                    {formatCurrency(transfer.amount, transfer.currency)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <CreditCard className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-muted-foreground">Transfer Charge</p>
                  <p className="font-medium">
                    {formatCurrency(transfer.txCharge, transfer.currency)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg col-span-2">
                <Banknote className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-muted-foreground">Total Debited</p>
                  <p className="font-bold text-lg text-red-600">
                    {formatCurrency(
                      (transfer.amount || 0) + (transfer.txCharge || 0),
                      transfer.currency
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 col-span-2">
                <Info className="h-4 w-4 text-indigo-500" />
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${transfer.txStatus === "success"
                      ? "bg-green-100 text-green-800"
                      : transfer.txStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                      }`}
                  >
                    {transfer.txStatus
                      ?.charAt(0)
                      .toUpperCase() + transfer.txStatus?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" /> Recipient Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-muted-foreground">Account Holder</p>
                    <p className="font-medium">{transfer.bankHolder}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-muted-foreground">Bank Name</p>
                    <p className="font-medium">{transfer.bankName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-muted-foreground">Account Number</p>
                    <p className="font-mono font-medium">
                      {transfer.bankAccount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-muted-foreground">Transfer Type</p>
                    <p className="font-medium capitalize">
                      {transfer.txRegion}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {transfer.txReason && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-gray-600" /> Description
                </h3>
                <p className="text-sm text-muted-foreground">
                  {transfer.txReason}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/transfer">Make Another Transfer</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
