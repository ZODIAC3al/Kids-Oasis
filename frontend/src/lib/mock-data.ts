export const academies = [
  {
    id: "1",
    name: "Bright Minds Early Learning",
    location: "Hayes Valley, San Francisco",
    rating: 4.9,
    reviews: 128,
    price: 1450,
    ages: "2–5 yrs",
    distance: "0.8 mi",
    tags: ["STEM Focus", "Transportation"],
    seats: 6,
    image:
      "https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Nature's Way Preschool",
    location: "Presidio, San Francisco",
    rating: 4.7,
    reviews: 84,
    price: 950,
    ages: "3–6 yrs",
    distance: "1.2 mi",
    tags: ["Outdoor Focus", "Organic Meals"],
    seats: 3,
    image:
      "https://images.unsplash.com/photo-1526634332515-d56c5fd16991?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Creative Minds Studio",
    location: "Marina District, San Francisco",
    rating: 5.0,
    reviews: 210,
    price: 1200,
    ages: "4–8 yrs",
    distance: "2.5 mi",
    tags: ["Montessori", "Language Immersion"],
    seats: 12,
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Oak Tree Montessori",
    location: "Noe Valley, San Francisco",
    rating: 4.8,
    reviews: 96,
    price: 1350,
    ages: "1–5 yrs",
    distance: "1.9 mi",
    tags: ["Toddler", "Primary"],
    seats: 4,
    image:
      "https://images.unsplash.com/photo-1567168539593-59673ababaf1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Elite Robotics Academy",
    location: "SoMa, San Francisco",
    rating: 4.9,
    reviews: 143,
    price: 1600,
    ages: "7–12 yrs",
    distance: "3.1 mi",
    tags: ["STEM", "Coding"],
    seats: 8,
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Sunrise Early Learning",
    location: "Bernal Heights, San Francisco",
    rating: 4.6,
    reviews: 71,
    price: 1100,
    ages: "3–5 yrs",
    distance: "2.2 mi",
    tags: ["Reggio Emilia", "Outdoor"],
    seats: 5,
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop",
  },
];

export const categories = [
  { name: "STEM", count: 240, image: "https://images.unsplash.com/photo-1581091012184-7e0cdfbb6797?q=80&w=800&auto=format&fit=crop" },
  { name: "Arts & Crafts", count: 180, image: "https://images.unsplash.com/photo-1499892477393-f675706cbe6e?q=80&w=800&auto=format&fit=crop" },
  { name: "Sports", count: 310, image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=800&auto=format&fit=crop" },
  { name: "Music", count: 150, image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=800&auto=format&fit=crop" },
];

export const revenueTrend = [
  { m: "Jan", v: 62 }, { m: "Feb", v: 68 }, { m: "Mar", v: 80 }, { m: "Apr", v: 74 },
  { m: "May", v: 90 }, { m: "Jun", v: 96 }, { m: "Jul", v: 88 }, { m: "Aug", v: 102 },
  { m: "Sep", v: 112 }, { m: "Oct", v: 108 }, { m: "Nov", v: 118 }, { m: "Dec", v: 124 },
];

export const enrollmentGrowth = [
  { m: "May", v: 310 }, { m: "Jun", v: 340 }, { m: "Jul", v: 365 },
  { m: "Aug", v: 395 }, { m: "Sep", v: 412 }, { m: "Oct", v: 428 },
];

export const revenueByProgram = [
  { name: "Robotics", v: 18500 },
  { name: "Coding", v: 12800 },
  { name: "Math", v: 7600 },
  { name: "Art", v: 3400 },
];

export const students = [
  { id: "84729", name: "Emma Thompson", grade: "Grade 3", avgGrade: 92, attendance: 98, status: "Present" },
  { id: "84730", name: "Jackson Reed", grade: "Grade 3", avgGrade: 78, attendance: 85, status: "Absent" },
  { id: "91204", name: "Leo Patel", grade: "Grade 4", avgGrade: 88, attendance: 95, status: "Present" },
  { id: "91788", name: "Sofia Martinez", grade: "Grade 4", avgGrade: 95, attendance: 99, status: "Present" },
  { id: "92311", name: "Noah Kim", grade: "Grade 3", avgGrade: 81, attendance: 90, status: "Present" },
];

export const auditLogs = [
  {
    ts: "2024-10-27 14:32:11",
    id: "req_8f72k9",
    event: "config.update",
    tone: "info" as const,
    actor: "Sarah Jenkins",
    ip: "192.168.1.45",
    detail: "Updated grading scale thresholds for course_id: 104",
    json: `{"old_threshold": 90, "new_threshold": 85}`,
  },
  {
    ts: "2024-10-27 14:15:02",
    id: "req_2a34bc",
    event: "auth.failed",
    tone: "danger" as const,
    actor: "system_user",
    ip: "45.22.109.11 (Blocked)",
    detail: "Multiple failed login attempts detected.",
    json: `{"reason": "invalid_credentials", "attempts": 5}`,
  },
  {
    ts: "2024-10-27 13:45:55",
    id: "req_9m88xq",
    event: "data.export",
    tone: "success" as const,
    actor: "Mark Roberts",
    ip: "10.0.4.22",
    detail: "Exported student attendance records for Q3.",
    json: `{"format": "csv", "filters": {"date_range": "2024-07-01_2024-09-30"}}`,
  },
  {
    ts: "2024-10-27 12:10:05",
    id: "req_4p22zl",
    event: "user.view",
    tone: "neutral" as const,
    actor: "Sarah Jenkins",
    ip: "192.168.1.45",
    detail: "Accessed profile of student_id: 8842",
    json: `{"action": "read", "resource": "/api/v1/users/8842/profile"}`,
  },
];

export const applications = [
  { id: "a1", name: "Emma Watson", track: "Early Years", note: "Application for pre-school program starting Fall 2024. Siblings currently enrolled.", when: "Today", stage: "Pending Review" },
  { id: "a2", name: "Liam Johnson", track: "Primary", note: "Transfer student from Oakridge Academy. Strong academic record.", when: "Yesterday", stage: "Interview" },
];

export const teachersMock = [
  { name: "Sarah Jenkins", role: "Lead Instructor · Early Explorers", satisfaction: 98 },
  { name: "Michael Chen", role: "STEM Coordinator", satisfaction: 96 },
  { name: "Elena Rodriguez", role: "Arts Director", satisfaction: 94 },
];
