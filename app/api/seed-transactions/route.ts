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
  { type: 'credit', amount: 714285, description: 'Monthly salary deposit' },
  { type: 'debit', amount: 24285.71, description: 'Grocery shopping at Walmart' },
  { type: 'credit', amount: 342857.14, description: 'Freelance project payment' },
  { type: 'debit', amount: 128571.43, description: 'Electric and water bill' },
  { type: 'debit', amount: 35714.29, description: 'Netflix and Spotify subscriptions' },
  { type: 'credit', amount: 1000000, description: 'Salary deposit - main job' },
  { type: 'debit', amount: 342857.14, description: 'Monthly rent payment' },
  { type: 'debit', amount: 18571.43, description: 'Coffee shop purchases' },
  { type: 'credit', amount: 71428.57, description: 'Refund from online store' },
  { type: 'debit', amount: 51428.57, description: 'Gas station fill-up' },
  { type: 'debit', amount: 27142.86, description: 'Pharmacy and medicines' },
  { type: 'credit', amount: 228571.43, description: 'Bonus payment from employer' },
  { type: 'debit', amount: 62857.14, description: 'Restaurant dinner with family' },
  { type: 'debit', amount: 12857.14, description: 'Mobile phone recharge' },
  { type: 'credit', amount: 428571.43, description: 'Consulting services payment' },
  { type: 'debit', amount: 100000, description: 'Car insurance premium' },
  { type: 'debit', amount: 34285.71, description: 'Gym membership renewal' },
  { type: 'debit', amount: 80000, description: 'New running shoes' },
  { type: 'credit', amount: 27142.86, description: 'Cashback reward credit' },
  { type: 'debit', amount: 21428.57, description: 'Books from Amazon' },
  { type: 'debit', amount: 154285.71, description: 'Home internet and cable bill' },
  { type: 'credit', amount: 628571.43, description: 'Part-time job payment' },
  { type: 'debit', amount: 47142.86, description: 'Barber and grooming services' },
  { type: 'debit', amount: 254285.71, description: 'Laptop repair service' },
  { type: 'credit', amount: 42857.14, description: 'Gift money from relative' },
  { type: 'debit', amount: 88571.43, description: 'Grocery shopping at Target' },
  { type: 'debit', amount: 121428.57, description: 'Dentist appointment' },
  { type: 'credit', amount: 914285.71, description: 'Monthly salary - secondary job' },
  { type: 'debit', amount: 27142.86, description: 'Movie tickets and popcorn' },
  { type: 'debit', amount: 191428.57, description: 'New winter jacket' },
  { type: 'credit', amount: 120000, description: 'Tax refund deposit' },
  { type: 'debit', amount: 15714.29, description: 'Fast food lunch' },
  { type: 'debit', amount: 68571.43, description: 'Pet supplies and vet visit' },
  { type: 'credit', amount: 514285.71, description: 'Dividend payment from investments' },
  { type: 'debit', amount: 111428.57, description: 'Home maintenance supplies' },
  { type: 'debit', amount: 42857.14, description: 'Birthday gift shopping' },
  { type: 'credit', amount: 78571.43, description: 'Sold old furniture online' },
  { type: 'debit', amount: 138571.43, description: 'New office chair' },
  { type: 'debit', amount: 35714.29, description: 'Parking fees for month' },
  { type: 'credit', amount: 271428.57, description: 'Tutoring services payment' },
  { type: 'debit', amount: 60000, description: 'Kitchen appliances' },
  { type: 'debit', amount: 97142.86, description: 'Wedding gift purchase' },
  { type: 'credit', amount: 800000, description: 'Salary deposit from employer' },
  { type: 'debit', amount: 22285.71, description: 'Stationery and office supplies' },
  { type: 'debit', amount: 161428.57, description: 'Flight tickets booking' },
  { type: 'credit', amount: 52857.14, description: 'Returned defective item refund' },
  { type: 'debit', amount: 26285.71, description: 'Laundry and dry cleaning' },
  { type: 'debit', amount: 120000, description: 'Health insurance premium' },
  { type: 'credit', amount: 314285.71, description: 'Graphic design project payment' },
  { type: 'debit', amount: 44285.71, description: 'Cosmetics and personal care' },
  { type: 'debit', amount: 194285.71, description: 'Hotel booking for weekend' },
  { type: 'credit', amount: 971428.57, description: 'Main salary deposit' },
  { type: 'debit', amount: 64285.71, description: 'Pizza delivery and snacks' },
  { type: 'debit', amount: 108571.43, description: 'Car maintenance service' },
  { type: 'credit', amount: 148571.43, description: 'Side hustle income' },
  { type: 'debit', amount: 41428.57, description: 'Video game purchase' },
  { type: 'debit', amount: 28000, description: 'Hardware store purchases' },
  { type: 'credit', amount: 600000, description: 'Commission payment' },
  { type: 'debit', amount: 75714.29, description: 'Concert tickets' },
  { type: 'debit', amount: 50000, description: 'Wine and beverages' },
  { type: 'credit', amount: 254285.71, description: 'Website development payment' },
  { type: 'debit', amount: 122857.14, description: 'New smartphone accessories' },
  { type: 'debit', amount: 24285.71, description: 'Ice cream and desserts' },
  { type: 'credit', amount: 471428.57, description: 'Rental income from property' },
  { type: 'debit', amount: 145714.29, description: 'Eyeglasses and eye exam' },
  { type: 'debit', amount: 55714.29, description: 'Sporting goods purchase' },
  { type: 'credit', amount: 97142.86, description: 'Survey participation reward' },
  { type: 'debit', amount: 205714.29, description: 'New wardrobe items' },
  { type: 'debit', amount: 30000, description: 'Car wash and detailing' },
  { type: 'credit', amount: 842857.14, description: 'Quarterly bonus payment' },
  { type: 'debit', amount: 81428.57, description: 'Garden supplies and plants' },
  { type: 'debit', amount: 118571.43, description: 'Furniture assembly service' },
  { type: 'credit', amount: 222857.14, description: 'Sold electronics online' },
  { type: 'debit', amount: 38571.43, description: 'Bakery and pastries' },
  { type: 'debit', amount: 168571.43, description: 'Anniversary dinner celebration' },
  { type: 'credit', amount: 414285.71, description: 'Photography session payment' },
  { type: 'debit', amount: 70000, description: 'Toys for kids' },
  { type: 'debit', amount: 104285.71, description: 'Home security system' },
  { type: 'credit', amount: 178571.43, description: 'Translation work payment' },
  { type: 'debit', amount: 25142.86, description: 'Breakfast at cafe' },
  { type: 'debit', amount: 134285.71, description: 'Luggage and travel bags' },
  { type: 'credit', amount: 885714.29, description: 'Monthly salary credit' },
  { type: 'debit', amount: 91428.57, description: 'Vitamins and supplements' },
  { type: 'debit', amount: 56571.43, description: 'Art supplies' },
  { type: 'credit', amount: 548571.43, description: 'Contract work payment' },
  { type: 'debit', amount: 72857.14, description: 'Streaming device purchase' },
  { type: 'debit', amount: 127142.86, description: 'Tailoring and alterations' },
  { type: 'credit', amount: 162857.14, description: 'Birthday money gift' },
  { type: 'debit', amount: 32857.14, description: 'Plant nursery shopping' },
  { type: 'debit', amount: 178571.43, description: 'Power tools purchase' },
  { type: 'credit', amount: 685714.29, description: 'Teaching assignment payment' },
  { type: 'debit', amount: 50000, description: 'Pet grooming service' },
  { type: 'debit', amount: 110000, description: 'Kitchen utensils and cookware' },
  { type: 'credit', amount: 365714.29, description: 'Writing project payment' },
  { type: 'debit', amount: 84285.71, description: 'Jewelry purchase' },
  { type: 'debit', amount: 40000, description: 'Charity donation' },
  { type: 'credit', amount: 231428.57, description: 'Stock dividend payment' },
  { type: 'debit', amount: 148571.43, description: 'Watch repair service' },
  { type: 'debit', amount: 58571.43, description: 'Craft supplies shopping' },
  { type: 'credit', amount: 500000, description: 'Freelance coding project' },
  { type: 'debit', amount: 97142.86, description: 'Yoga classes membership' },
  { type: 'debit', amount: 47142.86, description: 'Shoe repair and polish' },
  { type: 'credit', amount: 262857.14, description: 'Product review payment' },
  { type: 'debit', amount: 78571.43, description: 'Museum tickets and gift shop' },
  { type: 'debit', amount: 128571.43, description: 'Plumbing repair service' },
  { type: 'credit', amount: 757142.86, description: 'Year-end bonus deposit' },
  { type: 'debit', amount: 52857.14, description: 'Flower delivery service' },
  { type: 'debit', amount: 112857.14, description: 'New headphones purchase' },
  { type: 'credit', amount: 160000, description: 'Airbnb hosting income' },
  { type: 'debit', amount: 36571.43, description: 'Sushi restaurant dinner' },
  { type: 'debit', amount: 205714.29, description: 'Professional certification exam' },
  { type: 'credit', amount: 411428.57, description: 'Social media management fee' },
  { type: 'debit', amount: 67142.86, description: 'Printer ink and paper' },
  { type: 'debit', amount: 165714.29, description: 'New winter tires' },
  { type: 'credit', amount: 108571.43, description: 'Sold bicycle online' },
  { type: 'debit', amount: 27142.86, description: 'Music streaming premium' },
  { type: 'debit', amount: 132857.14, description: 'Professional headshot photos' },
  { type: 'credit', amount: 1741021428.57, description: 'Contract completion payment' },
  { type: 'debit', amount: 88571.43, description: 'House cleaning service' },
  { type: 'debit', amount: 44285.71, description: 'Drugstore essentials' },
  { type: 'credit', amount: 207142.86, description: 'Referral bonus credit' },
  { type: 'debit', amount: 125714.29, description: 'Veterinary checkup and shots' },
  { type: 'debit', amount: 56571.43, description: 'Board games and puzzles' },
  { type: 'credit', amount: 540000, description: 'Marketing consultation fee' },
  { type: 'debit', amount: 75714.29, description: 'Smart home devices' },
  { type: 'debit', amount: 107142.86, description: 'Upholstery cleaning service' },
  { type: 'credit', amount: 320000, description: 'Video editing project payment' },
  { type: 'debit', amount: 40571.43, description: 'Farmers market shopping' },
  { type: 'debit', amount: 168571.43, description: 'New mattress purchase' },
  { type: 'credit', amount: 851428.57, description: 'Performance bonus' },
  { type: 'debit', amount: 62285.71, description: 'Car registration renewal' },
  { type: 'debit', amount: 110000, description: 'Outdoor camping gear' },
  { type: 'credit', amount: 182857.14, description: 'Online course instructor fee' },
  { type: 'debit', amount: 50000, description: 'Professional resume service' },
  { type: 'debit', amount: 148571.43, description: 'Pool maintenance service' },
  { type: 'credit', amount: 2503457142.86, description: 'Dividend payout' },
  { type: 'debit', amount: 84285.71, description: 'Cookware set purchase' },
  { type: 'debit', amount: 47142.86, description: 'Wine tasting event' },
  { type: 'credit', amount: 445714.29, description: 'App development payment' },
  { type: 'debit', amount: 121428.57, description: 'Orthodontist appointment' },
  { type: 'debit', amount: 53714.29, description: 'Gardening tools' },
  { type: 'credit', amount: 254285.71, description: 'Podcast sponsorship revenue' },
  { type: 'debit', amount: 97142.86, description: 'Leather bags purchase' },
  { type: 'debit', amount: 72857.14, description: 'Home spa products' },
  { type: 'credit', amount: 1028571.43, description: 'Quarterly salary payment' },
  { type: 'debit', amount: 135714.29, description: 'Chimney cleaning service' }
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
            txType: data.type,
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
