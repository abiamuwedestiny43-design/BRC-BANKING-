// lib/utils/loan.ts
export function calculateMonthlyPayment(amount: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return amount / months
  
  return (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
         (Math.pow(1 + monthlyRate, months) - 1)
}

export function calculateTotalAmount(monthlyPayment: number, months: number): number {
  return monthlyPayment * months
}

export function getLoanTypeDetails(loanType: string) {
  const details = {
    personal: { 
      name: "Personal Loan", 
      maxAmount: 50000, 
      minAmount: 1000, 
      maxDuration: 60,
      interestRate: 12.5 
    },
    business: { 
      name: "Business Loan", 
      maxAmount: 20000000, 
      minAmount: 50000, 
      maxDuration: 120,
      interestRate: 10.5 
    },
    mortgage: { 
      name: "Mortgage Loan", 
      maxAmount: 100000000, 
      minAmount: 50000, 
      maxDuration: 360,
      interestRate: 7.5 
    },
    auto: { 
      name: "Auto Loan", 
      maxAmount: 1000000, 
      minAmount: 5000, 
      maxDuration: 84,
      interestRate: 8.5 
    },
    education: { 
      name: "Education Loan", 
      maxAmount: 100000, 
      minAmount: 1000, 
      maxDuration: 120,
      interestRate: 6.5 
    }
  }
  
  return details[loanType as keyof typeof details] || details.personal
}

export function generateLoanNumber(): string {
  return `LN${Date.now()}${Math.floor(Math.random() * 1000)}`
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'rejected': return 'bg-red-100 text-red-800'
    case 'active': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-gray-100 text-gray-800'
    case 'defaulted': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
