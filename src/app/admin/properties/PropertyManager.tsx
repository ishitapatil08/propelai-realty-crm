"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  MapPin,
  IndianRupee,
  Building2,
  Search,
  Users,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { createPropertyAction } from "@/lib/api/property-actions";
import { toast } from "sonner";

interface Property {
  id: string;
  name: string;
  location: string | null;
  price: number | null;
  createdAt: Date | string;
  type?: string;
  bhk?: string;
}

export function PropertyManager({
  initialProperties,
  totalLeadsCount,
}: {
  initialProperties: Property[];
  totalLeadsCount: number;
}) {
  const [propertiesList, setPropertiesList] = useState<Property[]>(initialProperties);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bhk, setBhk] = useState("3BHK");

  const filtered = propertiesList.filter((p) => {
    const query = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      (p.location && p.location.toLowerCase().includes(query))
    );
  });

  const totalPortfolioValue = propertiesList.reduce(
    (sum, p) => sum + (p.price || 0),
    0
  );

  async function handleAddProperty(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price) {
      toast.error("Please enter property name and price.");
      return;
    }

    setLoading(true);
    try {
      const res = await createPropertyAction({
        name,
        location,
        price: Number(price),
        bhk,
      });

      if (res?.success) {
        toast.success("Property added successfully!");
        setPropertiesList([res.property as any, ...propertiesList]);
        setName("");
        setLocation("");
        setPrice("");
        setIsOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add property.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-sm font-medium mb-1">
            <span>Total Properties</span>
            <Building2 className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold">{propertiesList.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Active inventory listings</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-sm font-medium mb-1">
            <span>Portfolio Valuation</span>
            <IndianRupee className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold tabular-nums">
            ₹{(totalPortfolioValue / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-xs text-muted-foreground mt-1">Combined market value</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-sm font-medium mb-1">
            <span>Active Lead Matches</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{totalLeadsCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Leads matching inventory budget</p>
        </div>
      </div>

      {/* Controls Header & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              List New Property
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                Add Real Estate Property
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddProperty} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Property Name *
                </label>
                <Input
                  placeholder="e.g. Grand Horizon Penthouse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Location / Area
                </label>
                <Input
                  placeholder="e.g. Jubilee Hills, Hyderabad"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Price (₹) *
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 15000000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Configuration
                  </label>
                  <select
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="1BHK">1 BHK</option>
                    <option value="2BHK">2 BHK</option>
                    <option value="3BHK">3 BHK</option>
                    <option value="4BHK+">4 BHK / Villa</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold"
                >
                  {loading ? "Adding..." : "Save Property"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Property Inventory Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property Listing</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Market Price (₹)</TableHead>
              <TableHead className="text-center">Lead Match Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                  No properties found matching "{search}". List a property to get started.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        <span className="text-[11px] text-muted-foreground">ID: {p.id}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {p.location ? (
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {p.location}
                      </div>
                    ) : (
                      <span className="italic text-muted-foreground/60 text-sm">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-medium text-xs">
                      {p.bhk || "Luxury Residence"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right font-semibold tabular-nums text-foreground">
                    {p.price ? (
                      <div>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          ₹{p.price >= 10000000 ? `${(p.price / 10000000).toFixed(2)} Cr` : `${(p.price / 100000).toFixed(1)} Lakhs`}
                        </span>
                        <p className="text-[11px] text-muted-foreground">₹{p.price.toLocaleString("en-IN")}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      <Sparkles className="w-3 h-3" />
                      Ready for AI Matching
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
