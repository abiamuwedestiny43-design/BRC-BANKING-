import { NextResponse } from "next/server"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import Transfer from "@/models/Transfer"
import TransferMeta from "@/models/TransferMeta"

const userData = {
  "email": "Marinoalbertrichies@gmail.com",
  "password": "$2b$12$NPIepQ95eyoDnnnySom3zuxdkbBy0yonjnlZDgFddQJ2hOGu1uXsK",
  "usercode": "N6twu",
  "roles": [
    "member"
  ],
  "bankInfo": {
    "security": {
      "pin": "$2b$12$DB5tUnnNNkPNMX2Hjx/MzeH2LI91dvVSw30OR3EakS/OwEHIOzRGm"
    },
    "bio": {
      "firstname": "RICHIE ",
      "lastname": "ALBERT MARINO",
      "phone": "+27730316664",
      "birthdate": new Date(-300412800000),
      "gender": "male",
      "religion": "others"
    },
    "address": {
      "location": "",
      "state": "",
      "city": "",
      "country": "",
      "zipcode": ""
    },
    "nok": {
      "firstname": "",
      "lastname": "",
      "relationship": "",
      "address": ""
    },
    "system": {
      "currency": "USD",
      "account": "savings account"
    }
  },
  "bankBalance": {
    "USD": 0
  },
  "bankNumber": "1046219285",
  "bankOtp": {
    "email": false,
    "transferCode": false
  },
  "bankAccount": {
    "verified": false,
    "canTransfer": false,
    "canLocalTransfer": false,
    "canInternationalTransfer": false
  },
  "transferCodeRequired": true,
  "registerTime": new Date("2026-01-03T02:41:03.787Z"),
  "lastSeen": new Date("2026-01-03T02:41:03.787Z"),
  "profileImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAEzAVMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooplxcx2kLSSyJFGoyzOwUAe5NAD6K8U+Lf/AAUi+AHwJjlPi34y/DbRZYG2SQS+ILZ7hT6eUjmT/wAdrxa8/wCDiP8AY1sdYayf426Q7rjMsWkajJBz0/erblCPcHFAH2pRXxH8O/8Ag4Q/ZP8AFmi+INRvvjP4Y0y20rUZIIVuYLmGW4gG0JKiGPfIGOfug46EDFep/BT/AIK2/sz/ALQ9/Z2fhL43fD3UL/UGCWtnPqqWN1cseipDceW7N7Bc0Bc+iaKSORZo1dGDKwyCDkEUtABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFBIUEk4AqO6uorG1knnkjhhhQvJI7BVRQMkkngADvX8yn/BwB/wcceMv2nPih4i+EfwU8RXnhv4RaaWsL7VbDMF74tkBxI3mg70tMjCKhXzFyXyGCK0gP0F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 shoe repair and polish",
};

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
  { type: 'credit', amount: 6093250, description: 'Contract completion payment' },
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
  { type: 'credit', amount: 8762100, description: 'dividend payout' },
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
    console.log("Starting seed process...")
    await dbConnect()
    
    // 1. Seed/Upsert User
    const updateData = userData;
    console.log("Seeding user:", userData.email)
    
    const user = await User.findOneAndUpdate(
      { email: userData.email },
      { $set: updateData },
      { upsert: true, new: true, runValidators: false }
    )

    if (!user) {
      console.error("Failed to seed/find user")
      return NextResponse.json({ message: "Failed to seed/find user" }, { status: 500 })
    }

    console.log("User seeded/found:", user._id)

    const userFullName = `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`
    const userAccountNumber = user.bankNumber || "1234567890"

    // Optional: Clear existing transfers for this user to avoid duplicates if re-running
    console.log("Clearing old transactions for user...")
    await Transfer.deleteMany({ userId: user._id.toString() })
    await TransferMeta.deleteMany({ userId: user._id })

    let seededCount = 0
    let totalBalance = 0

    // 2. Seed Transactions
    console.log("Seeding transactions...")
    for (const data of transactionsData) {
        // Calculate balance
        if (data.type === 'credit') {
            totalBalance += data.amount
        } else {
            totalBalance -= data.amount
        }

        const date = getRandomDate(new Date(2013, 0, 1), new Date(2026, 0, 2))
        const txRef = generateTxRef()
        const otherPartyAccount = generateRandomAccount()
        const otherPartyBank = getRandom(banks)
        
        let senderName, senderAccount, recipientName, recipientAccount, bankName, bankHolder, accountHolder

        if (data.type === 'credit') {
             const sender = getRandom(companies)
             senderName = sender
             senderAccount = otherPartyAccount
             recipientName = userFullName
             recipientAccount = userAccountNumber
             bankName = "External Bank"
             bankHolder = sender
             accountHolder = sender
        } else {
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
            userId: user._id.toString(),
            amount: data.amount,
            currency: "USD",
            txRef: txRef,
            txDate: date,
            txRegion: "local",
            transferType: "local",
            txStatus: "success",
            bankName: bankName,
            bankAccount: data.type === 'debit' ? otherPartyAccount : senderAccount,
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
            accountNumber: data.type === 'debit' ? recipientAccount : userAccountNumber,
            txType: data.type,
            amount: data.amount,
            status: true,
            userId: user._id
        })
        
        seededCount++
    }

    // 3. Update final user balance
    console.log("Updating final user balance to:", totalBalance)
    await User.findByIdAndUpdate(user._id, {
        $set: { "bankBalance.USD": totalBalance }
    })

    return NextResponse.json({ 
        message: `Successfully seeded user and ${seededCount} transactions. Updated balance to ${totalBalance} USD.`,
        user: { email: user.email, id: user._id, balance: totalBalance }
    })

  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ message: "Error seeding: " + (error as Error).message }, { status: 500 })
  }
}
