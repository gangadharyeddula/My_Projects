# arr =[10,20,30,40,50]
# target=30
# found=0
# for i in range(len(arr)):
#     if arr[i]==target:
#         found=1
#         print("Item Found at ",i+1,"Position")
#         break
# if found==0:
#     print("Item not Found")



###2nd Pronlem 
def Linear_Search(array,value):
    found=0
    for i in range (len(array)):
        if array[i]==value:
            found=1
            print(f"Item Found at {i+1} Position")
    if found==0:
        print("Item not found")
array=list(map(int,input("Enter List: ").split()))
value=int(input("Enter Target Value"))
Linear_Search(array,value)


#problem 3 
# def Count_of_Element(array,element):
#     i=0
#     j=len(array)
#     count=0
#     while i<j:
#         if  array[i]==element:
#           count+=1
#         i+=1
#     if count==0:
#         print("Item not found")
#     else:
#         print(f"Element Occurs {count} Times")
# array=list(map(int,input("Enter Array: ").split()))
# element=int(input("Enter element"))
# Count_of_Element(array,element)


#problem-4
# def binary_search(Array,Target):
#     low=0
#     high=len(Array)-1
#     found=0
#     while low <= high:
#         mid = (low+high)//2
#         if Array[mid] == Target:
#               found+=1
#               print(f"Element found at  index {mid}")
#         elif Target > Array[mid]:
#             low = mid+1
#             if found==0:
#                print("Item Not found")
#         else:
#             high=mid-1
#         break
      
# Array=list(map(int,input("Enter Array: ").split()))
# Target=int(input("Enter Target Value: "))
# binary_search(Array,Target)



# Problem-5 
# def Bubble_Sort(Array,n):
#     for i in range (n-1):
#         for j in range(n-i-1):
#             if Array[j]>Array[j+1]:
#               temp=Array[j]
#               Array[j]=Array[j+1]
#               Array[j+1]=temp
# Array=[]
# num=int(input("Enter Array Size: "))
# for i in range(num):
#     value=int(input())
#     Array.append(value)
# Bubble_Sort(Array,num)
# print(Array)

#problem - 6
def Insertion_Sort(a):
    for i in range (1,len(a)):
        temp=a[i]
        j=i-1
        while j>=0 and temp<a[j]:
            a[j+1]=a[j]
            j-=1
        a[j+1]=temp
a=list(map(int,input("Enter an array: ").split()))
Insertion_Sort(a)
print(a)