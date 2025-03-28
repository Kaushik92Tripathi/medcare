"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { useState, useEffect } from 'react'

import { Montserrat } from 'next/font/google';

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

interface Doctor {
  id: number
  name: string
  doctor?: {
    id: number
    degree: string
    experienceYears: number
    avgRating: number
    reviewCount: number
    specialty: {
      id: number
      name: string
    }
    location: {
      id: number
      name: string
      city: string
    }
  }
  // Fields for top doctors response
  degree?: string
  experienceYears?: number
  avgRating?: number
  specialtyName?: string
}

interface Specialty {
  id: number
  name: string
}

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedRating, setSelectedRating] = useState(0)
  const [selectedExperience, setSelectedExperience] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchTopDoctors = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/doctors/top')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch top doctors')
      }

      // Transform top doctors data to match the regular format
      const transformedDoctors = data.doctors.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        doctor: {
          id: doc.id,
          degree: doc.degree,
          experienceYears: doc.experienceYears,
          avgRating: doc.avgRating,
          reviewCount: 0, // This field is not available in top doctors
          specialty: {
            id: 0, // This field is not available in top doctors
            name: doc.specialtyName
          },
          location: {
            id: 0, // This field is not available in top doctors
            name: "",
            city: ""
          }
        }
      }))

      setDoctors(transformedDoctors)
      setSpecialties(data.specialties || [])
      setTotalPages(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch top doctors')
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '6',
        search: searchTerm,
        ...(selectedSpecialty && { specialty: selectedSpecialty }),
        ...(selectedRating > 0 && { minRating: selectedRating.toString() }),
        ...(selectedExperience && { minExperience: selectedExperience })
      })

      const response = await fetch(`/api/doctors?${queryParams}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch doctors')
      }

      setDoctors(data.doctors)
      setSpecialties(data.specialties)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors')
    } finally {
      setLoading(false)
    }
  }

  // Initial load - fetch top doctors
  useEffect(() => {
    fetchTopDoctors()
  }, [])

  // Handle filters and search
  useEffect(() => {
    if (!isInitialLoad) {
      fetchDoctors()
    }
  }, [currentPage, selectedSpecialty, selectedRating, selectedExperience, searchTerm, isInitialLoad])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    setIsInitialLoad(false)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
    setIsInitialLoad(false)
    if (e.target.value === '') {
      fetchTopDoctors()
      setIsInitialLoad(true)
    }
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
    setIsInitialLoad(false)
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto text-center md:px-6">
          <h1 className="mb-6 text-3xl font-bold md:text-4xl">Find a doctor at your own ease</h1>
          <div className="max-w-xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-grow">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  className="w-full h-12 pl-10 pr-4 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button type="submit" className="h-12 px-6 text-white rounded-r-md bg-primary hover:bg-primary/90">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 mx-auto md:px-6">
          <h2 className="mb-2 text-2xl font-bold text-center md:text-3xl">
            {loading ? 'Loading doctors...' : isInitialLoad ? 'Top Rated Doctors' : `${doctors.length} doctors available`}
          </h2>
          <p className="mb-8 text-center text-gray-500">
            Book appointments with minimum wait time & verified doctor details
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Filters */}
            <div className="md:col-span-3">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Filter By:</h3>
                  <button 
                    onClick={() => {
                      setSelectedRating(0)
                      setSelectedExperience('')
                      setSelectedSpecialty('')
                      handleFilterChange()
                    }} 
                    className="text-sm text-primary hover:underline"
                  >
                    Reset
                  </button>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="mb-2 font-medium">Rating</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value="0"
                        checked={selectedRating === 0}
                        onChange={(e) => {
                          setSelectedRating(Number(e.target.value))
                          handleFilterChange()
                        }}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="ml-2 text-sm">Show all</span>
                    </label>
                    {[4, 4.5].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={selectedRating === rating}
                          onChange={(e) => {
                            setSelectedRating(Number(e.target.value))
                            handleFilterChange()
                          }}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="ml-2 text-sm">{rating}+ star</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Filter */}
                <div className="mb-6">
                  <h4 className="mb-2 font-medium">Experience</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Show all', value: '' },
                      { label: '15+ years', value: '15' },
                      { label: '10-15 years', value: '10' },
                      { label: '5-10 years', value: '5' },
                      { label: '3-5 years', value: '3' },
                      { label: '1-3 years', value: '1' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="experience"
                          value={option.value}
                          checked={selectedExperience === option.value}
                          onChange={(e) => {
                            setSelectedExperience(e.target.value)
                            handleFilterChange()
                          }}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="ml-2 text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Specialty Filter */}
                <div>
                  <h4 className="mb-2 font-medium">Specialty</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="specialty"
                        value=""
                        checked={selectedSpecialty === ''}
                        onChange={(e) => {
                          setSelectedSpecialty(e.target.value)
                          handleFilterChange()
                        }}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="ml-2 text-sm">Show All</span>
                    </label>
                    {specialties?.map((specialty) => (
                      <label key={specialty.id} className="flex items-center">
                        <input
                          type="radio"
                          name="specialty"
                          value={specialty.name}
                          checked={selectedSpecialty === specialty.name}
                          onChange={(e) => {
                            setSelectedSpecialty(e.target.value)
                            handleFilterChange()
                          }}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="ml-2 text-sm">{specialty.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Cards */}
            <div className="md:col-span-9">
              {error ? (
                <div className="p-4 text-red-600 bg-red-50 rounded-lg">{error}</div>
              ) : loading ? (
                <div className="text-center">Loading doctors...</div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="overflow-hidden bg-white rounded-lg shadow-sm">
                      <div className="p-4 text-center">
                        <div className="flex justify-center mb-2">
                          <div className="w-24 h-24 overflow-hidden rounded-full">
                            <img
                              src="/default-avatar.png"
                              alt={doctor.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                        <h3 className="mb-1 text-lg font-medium">{doctor.name}</h3>
                        <div className="flex items-center justify-center mb-2 text-sm text-gray-500">
                          <span>{doctor.doctor?.specialty.name}</span>
                          <span className="mx-2">•</span>
                          <span>{doctor.doctor?.experienceYears} Years</span>
                        </div>
                        <div className="flex items-center justify-center mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, index) => (
                              <svg
                                key={index}
                                className={`w-4 h-4 ${
                                  index < Math.floor(doctor.doctor?.avgRating || 0)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <Link
                          href={`/appointments/doctor?id=${doctor.doctor?.id}`}
                          className="block w-full py-2 text-center text-white rounded-md bg-primary hover:bg-primary/90"
                        >
                          Book Appointment
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-2 text-sm font-medium border rounded-md ${
                          currentPage === i + 1
                            ? 'text-white bg-primary'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}