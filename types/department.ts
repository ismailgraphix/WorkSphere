export interface Department {
    id: string
    name: string
    departmentHead: {
      id: string
      name: string
      employeeId: string
    } | null
    isActive: boolean
  }
  
  