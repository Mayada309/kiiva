'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

import { Category, PaginationData } from '@/app/types';
import { adminFetch } from '@/utils/axios';

// table
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// edit button
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import SideHeading from '@/components/admin/dashboard/SideHeading';
import DeleteBtn from '@/components/admin/dashboard/DeleteBtn';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import PaginationContainer from '@/components/admin/dashboard/PaginationContainer';
import { useSearchParams } from 'next/navigation';

function Categories() {
  const [categories, setCategories] = useState<Category[]>();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>('');

  const [meta, setMeta] = useState<PaginationData>();

  const [open, setOpen] = useState<boolean>(false);

  const [isParent, setIsParent] = useState<boolean>(false);
  const [subCategories, setSubCategories] = useState<
    { id: number; name: string }[]
  >([{ id: 1, name: '' }]);
  const [nextId, setNextId] = useState<number>(2);

  const searchParams = useSearchParams();

  // Fetch categories
  const getCategories = async () => {
    try {
      const res = await adminFetch.get(`/categories?${searchParams}`);
      await console.log(res);

      if (res.status === 200) {
        setCategories(res.data.data);
        setMeta(res.data.meta);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.log(error);
      setCategories([]);
    }
  };

  useEffect(() => {
    getCategories();
  }, [searchParams]);

  // Open the modal for a specific category
  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name); // set initial value to the existing category name
  };

  // Close the modal
  const handleCloseEdit = () => {
    setEditingCategory(null);
    setNewCategoryName('');
  };

  // Edit category
  const handleEditCategory = async () => {
    if (!editingCategory) return;
    try {
      const res = await adminFetch.put(`/categories/${editingCategory.id}`, {
        name: newCategoryName,
      });
      if (res.status === 200) {
        getCategories();
        toast.success('Category updated successfully!');
        handleCloseEdit();
      }
    } catch (error) {
      console.log(error);
      toast.error('Sorry something went wrong');
    }
  };

  // Add Category
  const addCategory = async () => {
    const preparedSubCategories: { name: string }[] = subCategories.map(
      (subCategory) => ({ name: subCategory.name })
    );
    const data = isParent
      ? {
          name: newCategoryName,
          children: preparedSubCategories,
        }
      : {
          name: newCategoryName,
        };
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const payload = data;

      const res = await adminFetch.post('/categories', payload);
      if (res.status === 201) {
        getCategories();
        toast.success('Category added successfully!');
        // Reset form
        setOpen(false);
        setNewCategoryName('');
        setIsParent(false);
        setSubCategories([{ id: 1, name: '' }]);
        setNextId(2);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add category');
    }
  };

  // Add Sub-Category
  const addSubCategory = () => {
    if (subCategories.length >= 5) {
      toast.error('You have reached the maximum subcategories count');
      return;
    }
    setSubCategories([...subCategories, { id: nextId, name: '' }]);
    setNextId(nextId + 1);
  };

  // Remove Sub-Category
  const removeSubCategory = (id: number) => {
    setSubCategories(subCategories.filter((sub) => sub.id !== id));
  };

  if (!categories) {
    return (
      <div>
        <SideHeading title='categories' />
        <p>You have no categories</p>
      </div>
    );
  }

  return (
    <div className='p-4 w-full flex flex-col'>
      <div className='flex items-center justify-between'>
        <SideHeading title='categories' />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant='default'
              onClick={() => {
                setOpen(true);
                // Reset form when opening
                setNewCategoryName('');
                setIsParent(false);
                setSubCategories([{ id: 1, name: '' }]);
                setNextId(2);
              }}
            >
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <form className='grid gap-4 py-4'>
              <div className='flex flex-col gap-4 items-start justify-center'>
                <Label htmlFor='name' className='text-right'>
                  Name
                </Label>
                <Input
                  id='name'
                  name='name'
                  className='col-span-3'
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className='flex items-center space-x-2 '>
                <Checkbox
                  checked={isParent}
                  onClick={() => setIsParent(!isParent)}
                  id='isParent'
                />
                <label
                  htmlFor='isParent'
                  className='text-sm font-medium w-full leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Parent Category
                </label>
                <Button
                  variant={'ghost'}
                  className='text-2xl'
                  disabled={!isParent}
                  type='button'
                  onClick={addSubCategory}
                >
                  +
                </Button>
              </div>
              {isParent &&
                subCategories.map((sub) => (
                  <div
                    key={sub.id}
                    className='flex items-center justify-between gap-2'
                  >
                    <Input
                      type='text'
                      className='col-span-3'
                      placeholder='Sub-Category'
                      value={sub.name}
                      onChange={(e) => {
                        const updatedSubs = subCategories.map((s) =>
                          s.id === sub.id ? { ...s, name: e.target.value } : s
                        );
                        setSubCategories(updatedSubs);
                      }}
                    />
                    <Button
                      variant={'ghost'}
                      className='text-2xl'
                      type='button'
                      onClick={() => removeSubCategory(sub.id)}
                    >
                      -
                    </Button>
                  </div>
                ))}
            </form>
            <DialogFooter>
              <Button type='button' onClick={addCategory}>
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table className='w-full h-full text-lg'>
        <TableHeader>
          <TableRow className='text-slate-500 border-b-slate-300'>
            <TableHead className='font-bold'>Id</TableHead>
            <TableHead className='font-bold'>Name</TableHead>
            <TableHead className='font-bold'>Sub-Categories</TableHead>
            <TableHead className='font-bold'>Parent Category</TableHead>
            <TableHead className='font-bold'>Number of Products</TableHead>
            <TableHead className='font-bold'>Edit</TableHead>
            <TableHead className='font-bold'>Delete</TableHead>
            <TableHead className='font-bold'>View Products</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const {
              id,
              name,
              is_parent,
              children_count,
              products_count,
              parent,
            } = category;
            return (
              <TableRow className='border-b-slate-300' key={id}>
                <TableCell>{id}</TableCell>
                <TableCell className='font-medium'>{name}</TableCell>
                <TableCell>{is_parent ? children_count : 0}</TableCell>
                <TableCell>{parent?.name ?? '-'}</TableCell>
                <TableCell>{products_count}</TableCell>
                <TableCell className='text-green-500 cursor-pointer'>
                  <Dialog
                    // Open the dialog only if this category's ID matches editingCategory?.id
                    open={editingCategory?.id === id}
                    onOpenChange={(open) => {
                      // When dialog is closed (open = false), reset the editing state
                      if (!open) handleCloseEdit();
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant='ghost'
                        onClick={() => handleOpenEdit(category)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[425px]'>
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                      </DialogHeader>
                      <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                          <Label htmlFor='name' className='text-right'>
                            Name
                          </Label>
                          <Input
                            id='name'
                            value={newCategoryName}
                            className='col-span-3'
                            required
                            onChange={(e) => setNewCategoryName(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type='button' onClick={handleEditCategory}>
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>

                <TableCell className='text-red-500 cursor-pointer'>
                  <DeleteBtn api={`/categories/${id}`} />
                </TableCell>

                <TableCell className='text-slate-500 cursor-pointer hover:text-black transition-colors duration-100'>
                  <Link href={`categories/${id}`}>
                    <Button variant='ghost'>View Products</Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <PaginationContainer meta={meta} />
    </div>
  );
}

export default Categories;
