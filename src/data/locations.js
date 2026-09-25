/**
 * Location Data Dictionary
 * 
 * Architectural Intent:
 * A static, hierarchical representation of Bangladesh's geographical divisions, 
 * districts, and sub-districts (upazilas/thanas).
 * Used by cascading dropdowns in profile creation, job posting, and search filtering 
 * to provide a rigid, standardized location taxonomy that prevents free-text entry errors.
 */
export const locations = {
  "Dhaka": {
    "Dhaka": ["Dhanmondi", "Gulshan", "Banani", "Mirpur", "Uttara", "Mohammadpur", "Badda"],
    "Gazipur": ["Tongi", "Gazipur Sadar", "Kaliakair", "Kapasia", "Sreepur"],
    "Narayanganj": ["Narayanganj Sadar", "Bandar", "Rupganj", "Sonargaon", "Araihazar"],
    "Tangail": ["Tangail Sadar", "Mirzapur", "Ghatail", "Madhupur", "Bhuapur"],
    "Faridpur": ["Faridpur Sadar", "Boalmari", "Alfadanga", "Madhukhali", "Bhanga"]
  },
  "Chattogram": {
    "Chattogram": ["Pahartali", "Panchlaish", "Double Mooring", "Kotwali", "Halishahar"],
    "Cox's Bazar": ["Cox's Bazar Sadar", "Ramu", "Chakaria", "Ukhia", "Teknaf"],
    "Cumilla": ["Cumilla Sadar", "Laksam", "Daudkandi", "Chandina", "Burichang"],
    "Noakhali": ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya"]
  },
  "Rajshahi": {
    "Rajshahi": ["Boalia", "Rajpara", "Motihar", "Shah Makhdum", "Paba"],
    "Bogura": ["Bogura Sadar", "Shibganj", "Sherpur", "Dhunat", "Kahaloo"],
    "Naogaon": ["Naogaon Sadar", "Mohadevpur", "Manda", "Niamatpur", "Atrai"]
  },
  "Khulna": {
    "Khulna": ["Khulna Sadar", "Sonadanga", "Khalishpur", "Daulatpur", "Khan Jahan Ali"],
    "Jashore": ["Jashore Sadar", "Abhaynagar", "Jhikargachha", "Manirampur", "Keshabpur"],
    "Satkhira": ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Tala"]
  },
  "Barishal": {
    "Barishal": ["Barishal Sadar", "Bakerganj", "Babuganj", "Wazirpur", "Banaripara"],
    "Patuakhali": ["Patuakhali Sadar", "Bauphal", "Dashmina", "Galachipa", "Kalapara"],
    "Bhola": ["Bhola Sadar", "Daulatkhan", "Burhanuddin", "Tazumuddin", "Lalmohan"]
  },
  "Sylhet": {
    "Sylhet": ["Sylhet Sadar", "Dakshin Surma", "Bishwanath", "Golapganj", "Balaganj"],
    "Moulvibazar": ["Moulvibazar Sadar", "Sreemangal", "Rajnagar", "Kamalganj", "Kulaura"],
    "Habiganj": ["Habiganj Sadar", "Nabiganj", "Chunarughat", "Madhabpur", "Baniachong"]
  },
  "Rangpur": {
    "Rangpur": ["Rangpur Sadar", "Badarganj", "Mithapukur", "Pirganj", "Taraganj"],
    "Dinajpur": ["Dinajpur Sadar", "Birganj", "Kaharole", "Biral", "Bochaganj"],
    "Kurigram": ["Kurigram Sadar", "Nageshwari", "Bhurungamari", "Phulbari", "Rajarhat"]
  },
  "Mymensingh": {
    "Mymensingh": ["Mymensingh Sadar", "Muktagacha", "Valuka", "Trishal", "Gaffargaon"],
    "Jamalpur": ["Jamalpur Sadar", "Melandaha", "Islampur", "Dewanganj", "Sarishabari"],
    "Netrokona": ["Netrokona Sadar", "Barhatta", "Atpara", "Kendua", "Madan"]
  }
};
