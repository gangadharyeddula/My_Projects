import os

DATA_FILE = 'students.txt'

def add_student():
    roll = input("Enter Roll No: ")
    name = input("Enter Name: ")
    age = input("Enter Age: ")
    course = input("Enter Course: ")
    
    with open(DATA_FILE, 'a') as f:
        f.write(f"{roll},{name},{age},{course}\n")
    print("Student added successfully.\n")

def view_students():
    if not os.path.exists(DATA_FILE):
        print("No data found.")
        return

    print("\n--- Student Records ---")
    with open(DATA_FILE, 'r') as f:
        for line in f:
            roll, name, age, course = line.strip().split(',')
            print(f"Roll No: {roll}, Name: {name}, Age: {age}, Course: {course}")
    print()

def search_student():
    roll_to_search = input("Enter Roll No to search: ")
    found = False
    with open(DATA_FILE, 'r') as f:
        for line in f:
            roll, name, age, course = line.strip().split(',')
            if roll == roll_to_search:
                print(f"Found: Roll No: {roll}, Name: {name}, Age: {age}, Course: {course}")
                found = True
                break
    if not found:
        print("Student not found.\n")

def update_student():
    roll_to_update = input("Enter Roll No to update: ")
    updated = False
    new_lines = []
    with open(DATA_FILE, 'r') as f:
        for line in f:
            roll, name, age, course = line.strip().split(',')
            if roll == roll_to_update:
                print("Enter new details:")
                name = input("Enter Name: ")
                age = input("Enter Age: ")
                course = input("Enter Course: ")
                new_lines.append(f"{roll},{name},{age},{course}\n")
                updated = True
            else:
                new_lines.append(line)
    
    with open(DATA_FILE, 'w') as f:
        f.writelines(new_lines)

    if updated:
        print("Student updated successfully.\n")
    else:
        print("Student not found.\n")

def delete_student():
    roll_to_delete = input("Enter Roll No to delete: ")
    deleted = False
    new_lines = []
    with open(DATA_FILE, 'r') as f:
        for line in f:
            roll, name, age, course = line.strip().split(',')
            if roll == roll_to_delete:
                deleted = True
                continue
            new_lines.append(line)
    
    with open(DATA_FILE, 'w') as f:
        f.writelines(new_lines)

    if deleted:
        print("Student deleted successfully.\n")
    else:
        print("Student not found.\n")

def main_menu():
    while True:
        print("\n--- Student Data Management System ---")
        print("1. Add Student")
        print("2. View Students")
        print("3. Search Student")
        print("4. Update Student")
        print("5. Delete Student")
        print("6. Exit")
        
        choice = input("Enter your choice (1-6): ")

        if choice == '1':
            add_student()
        elif choice == '2':
            view_students()
        elif choice == '3':
            search_student()
        elif choice == '4':
            update_student()
        elif choice == '5':
            delete_student()
        elif choice == '6':
            print("Exiting system. Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.\n")

if __name__ == "__main__":
    main_menu()
