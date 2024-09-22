import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => (
  <div className="relative w-full md:w-2/3 lg:w-1/2 mb-4">
    <input
      type="text"
      placeholder="Search courses..."
      className="w-full px-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  </div>
);