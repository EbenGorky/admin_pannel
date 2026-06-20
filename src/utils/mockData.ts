import type { Employee } from '@/types'

const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa', 'James', 'Emma', 'Robert', 'Olivia', 'William', 'Sophia', 'Daniel', 'Isabella', 'Matthew']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Jackson']
const departments = ['My Team', 'General']
const teams = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'Xray', 'Yankee']
const shifts = ['Morning', 'Evening', 'Night', 'Rotational']
const statuses: Employee['status'][] = ['active', 'active', 'active', 'active', 'active', 'absent', 'on-leave', 'break', 'offline', 'active', 'active', 'active']

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateMockEmployees(count = 48): Employee[] {
  const usedNames = new Set<string>()
  function uniqueName() {
    for (let attempt = 0; attempt < 100; attempt++) {
      const name = `${randomItem(firstNames)} ${randomItem(lastNames)}`
      if (!usedNames.has(name)) { usedNames.add(name); return name }
    }
    return `${randomItem(firstNames)} ${randomItem(lastNames)}`
  }

  function makeEmployee(index: number, team: string): Employee {
    const name = uniqueName()
    return {
      id: `EMP-${String(index + 1).padStart(4, '0')}`,
      name,
      employeeId: `EMP-${String(index + 1).padStart(4, '0')}`,
      email: `${name.toLowerCase().replace(' ', '.')}@veevinpower.com`,
      phone: `+1 (${randomInt(200, 999)}) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
      department: randomItem(departments),
      team,
      shift: randomItem(shifts),
      designation: randomItem(['Field Technician', 'Senior Technician', 'Team Lead', 'Engineer', 'Supervisor']),
      manager: randomItem(['Alex Johnson', 'Maria Garcia', 'Tom Chen', 'Sarah Wilson']),
      status: randomItem(statuses),
      todayHours: Math.round((Math.random() * 8 + 1) * 10) / 10,
      breakTime: Math.round(Math.random() * 60),
      overtime: Math.round(Math.random() * 30),
      late: Math.round(Math.random() * 15),
      battery: Math.round(Math.random() * 60 + 20),
      joinDate: `202${randomInt(0, 4)}-${String(randomInt(1, 12)).padStart(2, '0')}-${String(randomInt(1, 28)).padStart(2, '0')}`,
      location: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.006 + (Math.random() - 0.5) * 0.1,
        address: `${randomInt(100, 9999)} ${randomItem(['Main St', 'Oak Ave', 'Pine Rd', 'Broadway', 'Park Blvd', 'Market St'])}, New York, NY`,
      },
    }
  }

  const employees: Employee[] = []
  // First 20 employees are unassigned
  for (let i = 0; i < 20; i++) {
    employees.push(makeEmployee(i, ''))
  }
  // Assign one per team for remaining employees
  const remaining = count - 20
  teams.forEach((team, i) => {
    if (i < remaining) employees.push(makeEmployee(20 + i, team))
  })
  // Distribute any extra randomly
  for (let i = 20 + teams.length; i < count; i++) {
    employees.push(makeEmployee(i, randomItem(teams)))
  }
  return employees
}

export function generateEmployeeById(id: string): Employee {
  const all = generateMockEmployees(1)
  return { ...all[0], id, employeeId: id }
}
