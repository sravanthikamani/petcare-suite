import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'Companion Animal Veterinarians(dogs,cats,birds)' 
    ? navigate('/doctors') 
    : navigate('/doctors/Companion Animal Veterinarians(dogs,cats,birds)')} 
    className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Companion Animal Veterinarians(dogs,cats,birds)' ? 'bg-[#E2E5FF] text-black ' : ''}`}>
    Companion Animal Veterinarians (dogs, cats, birds)
</p>

<p onClick={() => speciality === 'Food Animal Veterinarians(cows,goats,sheeps,poultry)' 
    ? navigate('/doctors') 
    : navigate('/doctors/Food Animal Veterinarians(cows,goats,sheeps,poultry)')} 
    className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Food Animal Veterinarians(cows,goats,sheeps,poultry)' ? 'bg-[#E2E5FF] text-black ' : ''}`}>
    Food Animal Veterinarians (cows, goats, sheeps, poultry)
</p>

<p onClick={() => speciality === 'Equine Veterinarians(horses)' 
    ? navigate('/doctors') 
    : navigate('/doctors/Equine Veterinarians(horses)')} 
    className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Equine Veterinarians(horses)' ? 'bg-[#E2E5FF] text-black ' : ''}`}>
    Equine Veterinarians (horses)
</p>

<p onClick={() => speciality === 'Veterinary Surgeons(bone, soft tissue, orthopedic, etc.)' 
    ? navigate('/doctors') 
    : navigate('/doctors/Veterinary Surgeons(bone, soft tissue, orthopedic, etc.)')} 
    className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Veterinary Surgeons(bone, soft tissue, orthopedic, etc.)' ? 'bg-[#E2E5FF] text-black ' : ''}`}>
    Veterinary Surgeons (bone, soft tissue, orthopedic, etc.)
</p>

<p onClick={() => speciality === 'Veterinary Dermatologists' 
    ? navigate('/doctors') 
    : navigate('/doctors/Veterinary Dermatologists')} 
    className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Veterinary Dermatologists' ? 'bg-[#E2E5FF] text-black ' : ''}`}>
    Veterinary Dermatologists
</p>

<p onClick={() => speciality === 'Veterinary Ophthalmologists' 
    ? navigate('/doctors') 
    : navigate('/doctors/Veterinary Ophthalmologists')} 
    className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Veterinary Ophthalmologists' ? 'bg-[#E2E5FF] text-black ' : ''}`}>
    Veterinary Ophthalmologists
</p>

        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.map((item, index) => (
            <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
              <img className='bg-[#EAEFFF]' src={item.image} alt="" />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                </div>
                <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors