"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "@/config/environment";

const ItemContext = createContext();

export const useItems = () => useContext(ItemContext);

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/items`);
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (error) {
      setError('Failed to fetch items');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/items/${id}`);
      if (response.data.success) {
        return response.data.item;
      }
    } catch (error) {
      setError('Failed to fetch item');
      console.error('Error fetching item:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/items`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        setItems(prevItems => [response.data.item, ...prevItems]);
        return response.data.item;
      }
    } catch (error) {
      setError('Failed to add item');
      console.error('Error adding item:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitInquiry = async (inquiryData) => {
    try {
      const response = await axios.post(`${API_URL}/api/inquiries`, inquiryData);
      
      if (response.data.success) {
        toast.success('Your inquiry has been sent successfully!');
        return true;
      }
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast.error('Failed to send inquiry. Please try again later.');
      return false;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const value = {
    items,
    loading,
    error,
    fetchItems,
    fetchItemById,
    addItem,
    submitInquiry
  };

  return (
    <ItemContext.Provider value={value}>
      {children}
    </ItemContext.Provider>
  );
};

export default ItemContext;