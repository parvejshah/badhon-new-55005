export const BLOOD_GROUP_COLORS: Record<string, string> = {
  'A+': 'bg-red-100 text-red-800 border-red-300',
  'A-': 'bg-red-50 text-red-700 border-red-200',
  'B+': 'bg-blue-100 text-blue-800 border-blue-300',
  'B-': 'bg-blue-50 text-blue-700 border-blue-200',
  'O+': 'bg-green-100 text-green-800 border-green-300',
  'O-': 'bg-green-50 text-green-700 border-green-200',
  'AB+': 'bg-purple-100 text-purple-800 border-purple-300',
  'AB-': 'bg-purple-50 text-purple-700 border-purple-200',
};

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const;
export type BloodGroup = typeof BLOOD_GROUPS[number];
