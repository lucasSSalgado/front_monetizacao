"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type React from "react"

import { useState } from "react"
import { Busca } from "./types/type"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(searchQuery)

    const stopwords = ["a", "o", "e", "da", "de", "do", "com", "para", "em", "um", "uma", "os", "as"];
    const keywords = searchQuery.split(' ').filter(k => k && !stopwords.includes(k.toLowerCase()));

    const busca: Busca = {
      termosInclude: keywords.map(k => [k]),
      periodo: ["2023-01-01", "2023-12-31"]
    }

    const t = await fetch('http://localhost:8080/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(busca)
    })

    let r

    try {
      r = await t.json()
    } catch (error) {
      console.log(error)
    }

    console.log(r)
    sessionStorage.setItem('searchQuery', JSON.stringify(keywords))
    sessionStorage.setItem('searchResults', JSON.stringify(r))
    window.location.href = '/results'
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-2xl flex flex-col items-center space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-normal text-gray-700 mb-2">
            <span className="text-gray-700">Melhor Preço</span>
          </h1>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite o nome de um produto ou descrição de item desejado"
              className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-full hover:border-gray-300 focus:border-blue-500 focus:ring-0 focus:outline-none transition-colors duration-200"
            />
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            onClick={handleSearch}
            variant="outline"
            className="px-6 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            Buscar Produtos
          </Button>
        </div>
      </div>
    </div>
  )
}
