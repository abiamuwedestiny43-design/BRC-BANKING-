import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import TransferMeta from "@/models/TransferMeta"
import { toPlainObject } from "@/lib/serialization"

const transactionsData = [
  { type: 'credit', amount: 2500, description: 'Monthly salary deposit' },
  { type: 'debit', amount: 85, description: 'Grocery shopping at Walmart' },
  { type: 'credit', amount: 1200, description: 'Freelance project payment' },
  { type: 'debit', amount: 450, description: 'Electric and water bill' },
  { type: 'debit', amount: 125, description: 'Netflix and Spotify subscriptions' },
  { type: 'credit', amount: 3500, description: 'Salary deposit - main job' },
  { type: 'debit', amount: 1200, description: 'Monthly rent payment' },
  { type: 'debit', amount: 65, description: 'Coffee shop purchases' },
  { type: 'credit', amount: 250, description: 'Refund from online store' },
  { type: 'debit', amount: 180, description: 'Gas station fill-up' },
  { type: 'debit', amount: 95, description: 'Pharmacy and medicines' },
  { type: 'credit', amount: 800, description: 'Bonus payment from employer' },
  { type: 'debit', amount: 220, description: 'Restaurant dinner with family' },
  { type: 'debit', amount: 45, description: 'Mobile phone recharge' },
  { type: 'credit', amount: 1500, description: 'Consulting services payment' },
  { type: 'debit', amount: 350, description: 'Car insurance premium' },
  { type: 'debit', amount: 120, description: 'Gym membership renewal' },
  { type: 'debit', amount: 280, description: 'New running shoes' },
  { type: 'credit', amount: 95, description: 'Cashback reward credit' },
  { type: 'debit', amount: 75, description: 'Books from Amazon' },
  { type: 'debit', amount: 540, description: 'Home internet and cable bill' },
  { type: 'credit', amount: 2200, description: 'Part-time job payment' },
  { type: 'debit', amount: 165, description: 'Barber and grooming services' },
  { type: 'debit', amount: 890, description: 'Laptop repair service' },
  { type: 'credit', amount: 150, description: 'Gift money from relative' },
  { type: 'debit', amount: 310, description: 'Grocery shopping at Target' },
  { type: 'debit', amount: 425, description: 'Dentist appointment' },
  { type: 'credit', amount: 3200, description: 'Monthly salary - secondary job' },
  { type: 'debit', amount: 95, description: 'Movie tickets and popcorn' },
  { type: 'debit', amount: 670, description: 'New winter jacket' },
  { type: 'credit', amount: 420, description: 'Tax refund deposit' },
  { type: 'debit', amount: 55, description: 'Fast food lunch' },
  { type: 'debit', amount: 240, description: 'Pet supplies and vet visit' },
  { type: 'credit', amount: 1800, description: 'Dividend payment from investments' },
  { type: 'debit', amount: 390, description: 'Home maintenance supplies' },
  { type: 'debit', amount: 150, description: 'Birthday gift shopping' },
  { type: 'credit', amount: 275, description: 'Sold old furniture online' },
  { type: 'debit', amount: 485, description: 'New office chair' },
  { type: 'debit', amount: 125, description: 'Parking fees for month' },
  { type: 'credit', amount: 950, description: 'Tutoring services payment' },
  { type: 'debit', amount: 210, description: 'Kitchen appliances' },
  { type: 'debit', amount: 340, description: 'Wedding gift purchase' },
  { type: 'credit', amount: 2800, description: 'Salary deposit from employer' },
  { type: 'debit', amount: 78, description: 'Stationery and office supplies' },
  { type: 'debit', amount: 565, description: 'Flight tickets booking' },
  { type: 'credit', amount: 185, description: 'Returned defective item refund' },
  { type: 'debit', amount: 92, description: 'Laundry and dry cleaning' },
  { type: 'debit', amount: 420, description: 'Health insurance premium' },
  { type: 'credit', amount: 1100, description: 'Graphic design project payment' },
  { type: 'debit', amount: 155, description: 'Cosmetics and personal care' },
  { type: 'debit', amount: 680, description: 'Hotel booking for weekend' },
  { type: 'credit', amount: 3400, description: 'Main salary deposit' },
  { type: 'debit', amount: 225, description: 'Pizza delivery and snacks' },
  { type: 'debit', amount: 380, description: 'Car maintenance service' },
  { type: 'credit', amount: 520, description: 'Side hustle income' },
  { type: 'debit', amount: 145, description: 'Video game purchase' },
  { type: 'debit', amount: 98, description: 'Hardware store purchases' },
  { type: 'credit', amount: 2100, description: 'Commission payment' },
  { type: 'debit', amount: 265, description: 'Concert tickets' },
  { type: 'debit', amount: 175, description: 'Wine and beverages' },
  { type: 'credit', amount: 890, description: 'Website development payment' },
  { type: 'debit', amount: 430, description: 'New smartphone accessories' },
  { type: 'debit', amount: 85, description: 'Ice cream and desserts' },
  { type: 'credit', amount: 1650, description: 'Rental income from property' },
  { type: 'debit', amount: 510, description: 'Eyeglasses and eye exam' },
  { type: 'debit', amount: 195, description: 'Sporting goods purchase' },
  { type: 'credit', amount: 340, description: 'Survey participation reward' },
  { type: 'debit', amount: 720, description: 'New wardrobe items' },
  { type: 'debit', amount: 105, description: 'Car wash and detailing' },
  { type: 'credit', amount: 2950, description: 'Quarterly bonus payment' },
  { type: 'debit', amount: 285, description: 'Garden supplies and plants' },
  { type: 'debit', amount: 415, description: 'Furniture assembly service' },
  { type: 'credit', amount: 780, description: 'Sold electronics online' },
  { type: 'debit', amount: 135, description: 'Bakery and pastries' },
  { type: 'debit', amount: 590, description: 'Anniversary dinner celebration' },
  { type: 'credit', amount: 1450, description: 'Photography session payment' },
  { type: 'debit', amount: 245, description: 'Toys for kids' },
  { type: 'debit', amount: 365, description: 'Home security system' },
  { type: 'credit', amount: 625, description: 'Translation work payment' },
  { type: 'debit', amount: 88, description: 'Breakfast at cafe' },
  { type: 'debit', amount: 470, description: 'Luggage and travel bags' },
  { type: 'credit', amount: 3100, description: 'Monthly salary credit' },
  { type: 'debit', amount: 320, description: 'Vitamins and supplements' },
  { type: 'debit', amount: 198, description: 'Art supplies' },
  { type: 'credit', amount: 1920, description: 'Contract work payment' },
  { type: 'debit', amount: 255, description: 'Streaming device purchase' },
  { type: 'debit', amount: 445, description: 'Tailoring and alterations' },
  { type: 'credit', amount: 570, description: 'Birthday money gift' },
  { type: 'debit', amount: 115, description: 'Plant nursery shopping' },
  { type: 'debit', amount: 625, description: 'Power tools purchase' },
  { type: 'credit', amount: 2400, description: 'Teaching assignment payment' },
  { type: 'debit', amount: 175, description: 'Pet grooming service' },
  { type: 'debit', amount: 385, description: 'Kitchen utensils and cookware' },
  { type: 'credit', amount: 1280, description: 'Writing project payment' },
  { type: 'debit', amount: 295, description: 'Jewelry purchase' },
  { type: 'debit', amount: 140, description: 'Charity donation' },
  { type: 'credit', amount: 810, description: 'Stock dividend payment' },
  { type: 'debit', amount: 520, description: 'Watch repair service' },
  { type: 'debit', amount: 205, description: 'Craft supplies shopping' },
  { type: 'credit', amount: 1750, description: 'Freelance coding project' },
  { type: 'debit', amount: 340, description: 'Yoga classes membership' },
  { type: 'debit', amount: 165, description: 'Shoe repair and polish' },
  { type: 'credit', amount: 920, description: 'Product review payment' },
  { type: 'debit', amount: 275, description: 'Museum tickets and gift shop' },
  { type: 'debit', amount: 450, description: 'Plumbing repair service' },
  { type: 'credit', amount: 2650, description: 'Year-end bonus deposit' },
  { type: 'debit', amount: 185, description: 'Flower delivery service' },
  { type: 'debit', amount: 395, description: 'New headphones purchase' },
  { type: 'credit', amount: 560, description: 'Airbnb hosting income' },
  { type: 'debit', amount: 128, description: 'Sushi restaurant dinner' },
  { type: 'debit', amount: 720, description: 'Professional certification exam' },
  { type: 'credit', amount: 1440, description: 'Social media management fee' },
  { type: 'debit', amount: 235, description: 'Printer ink and paper' },
  { type: 'debit', amount: 580, description: 'New winter tires' },
  { type: 'credit', amount: 380, description: 'Sold bicycle online' },
  { type: 'debit', amount: 95, description: 'Music streaming premium' },
  { type: 'debit', amount: 465, description: 'Professional headshot photos' },
  { type: 'credit', amount: 3250, description: 'Contract completion payment' },
  { type: 'debit', amount: 310, description: 'House cleaning service' },
  { type: 'debit', amount: 155, description: 'Drugstore essentials' },
  { type: 'credit', amount: 725, description: 'Referral bonus credit' },
  { type: 'debit', amount: 440, description: 'Veterinary checkup and shots' },
  { type: 'debit', amount: 198, description: 'Board games and puzzles' },
  { type: 'credit', amount: 1890, description: 'Marketing consultation fee' },
  { type: 'debit', amount: 265, description: 'Smart home devices' },
  { type: 'debit', amount: 375, description: 'Upholstery cleaning service' },
  { type: 'credit', amount: 1120, description: 'Video editing project payment' },
  { type: 'debit', amount: 142, description: 'Farmers market shopping' },
  { type: 'debit', amount: 590, description: 'New mattress purchase' },
  { type: 'credit', amount: 2980, description: 'Performance bonus' },
  { type: 'debit', amount: 218, description: 'Car registration renewal' },
  { type: 'debit', amount: 385, description: 'Outdoor camping gear' },
  { type: 'credit', amount: 640, description: 'Online course instructor fee' },
  { type: 'debit', amount: 175, description: 'Professional resume service' },
  { type: 'debit', amount: 520, description: 'Pool maintenance service' },
  { type: 'credit', amount: 2100, description: 'Annual dividend payout' },
  { type: 'debit', amount: 295, description: 'Cookware set purchase' },
  { type: 'debit', amount: 165, description: 'Wine tasting event' },
  { type: 'credit', amount: 1560, description: 'App development payment' },
  { type: 'debit', amount: 425, description: 'Orthodontist appointment' },
  { type: 'debit', amount: 188, description: 'Gardening tools' },
  { type: 'credit', amount: 890, description: 'Podcast sponsorship revenue' },
  { type: 'debit', amount: 340, description: 'Leather bags purchase' },
  { type: 'debit', amount: 255, description: 'Home spa products' },
  { type: 'credit', amount: 3600, description: 'Quarterly salary payment' },
  { type: 'debit', amount: 475, description: 'Chimney cleaning service' }
];

// Random helpers
const banks = ["Chase", "Bank of America", "Wells Fargo", "Citi", "Capital One", "HSBC", "Barclays"]
const companies = ["Tech Corp LLC", "Global Services Inc", "Payroll Systems", "Client Invoice", "Refund Process", "Investment Inc"]
const people = ["Alice Johnson", "Bob Wilson", "Charlie Brown", "Diana Prince", "Clark Kent", "Bruce Wayne", "Peter Parker"]

function getRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function generateTxRef(): string {
    return "TX-" + Math.floor(100000000 + Math.random() * 900000000).toString()
}

function generateRandomAccount(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString()
}

export async function GET() {
  try {
    const userDoc = await getCurrentUser()
    if (!userDoc) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    
    const user = toPlainObject(userDoc)
    await dbConnect()

    const userFullName = user.bankInfo?.bio?.firstname ? `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}` : "User"
    const userAccountNumber = user.bankNumber || "1234567890"

    let seededCount = 0

    // Iterate over provided transactions
    for (const data of transactionsData) {
        const date = getRandomDate(new Date(2013, 0, 1), new Date(2026, 0, 2)) // ~2013 to 2026
        const txRef = generateTxRef()
        const otherPartyAccount = generateRandomAccount()
        const otherPartyBank = getRandom(banks)
        
        let senderName, senderAccount, recipientName, recipientAccount, bankName, bankHolder, accountHolder

        if (data.type === 'credit') {
             // Money coming IN to user
             // Sender = Random Company/Person
             // Recipient = User
             const sender = getRandom(companies)
             
             senderName = sender
             senderAccount = otherPartyAccount
             
             recipientName = userFullName
             recipientAccount = userAccountNumber
             
             // For Transfer Model (Source logic often uses bank details of the sender in 'bankName' etc depending on schema interpretation, 
             // but 'accountHolder' usually refers to the counterparty in a simplified view or the person 'holding' the external account).
             // Let's stick to the convention used previously:
             // Credit -> 'accountHolder' is the sender (source of funds)
             
             bankName = "External Bank"
             bankHolder = sender
             accountHolder = sender
             
        } else {
            // Money going OUT from user
            // Sender = User
            // Recipient = Random Person/Shop
            const recipient = getRandom(people)
             
            senderName = userFullName
            senderAccount = userAccountNumber
            
            recipientName = recipient
            recipientAccount = otherPartyAccount
            
            bankName = otherPartyBank
            bankHolder = recipient
            accountHolder = recipient
        }

        await Transfer.create({
            userId: user._id,
            amount: data.amount,
            currency: "USD",
            txRef: txRef,
            txDate: date,
            txRegion: "local",
            transferType: "local",
            txStatus: "success",
            
            bankName: bankName,
            bankAccount: data.type === 'debit' ? otherPartyAccount : senderAccount, // External account
            accountNumber: data.type === 'debit' ? otherPartyAccount : senderAccount,
            bankHolder: bankHolder,
            accountHolder: accountHolder,
            
            description: data.description,
            senderName: senderName,
            senderAccount: senderAccount,
            
            completedAt: date
        })
        
        await TransferMeta.create({
            txRef: txRef,
            accountNumber: data.type === 'debit' ? recipientAccount : userAccountNumber, // The account associated with the directional logic or metadata target
            txType: data.type,
            amount: data.amount,
            status: true,
            userId: user._id
        })
        
        seededCount++
    }

    return NextResponse.json({ message: `Successfully seeded ${seededCount} transactions from 2013-2026.` })

  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ message: "Error seeding transactions: " + (error as Error).message }, { status: 500 })
  }
}
