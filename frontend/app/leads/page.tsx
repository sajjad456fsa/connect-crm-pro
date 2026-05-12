"use client";

import { useEffect, useState } from "react";
import { api, setAuthToken } from "@/lib/api";
import { Sidebar } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Filter, Search, User, Phone, Mail, MapPin, DollarSign, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: string;
  leadId: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  leadSource?: string;
  status: string;
  priority: string;
  budgetValue?: number;
  country?: string;
  city?: string;
  address?: string;
  notes?: string;
  tags: string[];
  followUpDate?: string;
  nextMeetingDate?: string;
  assignedSalesPerson?: {
    id: string;
    name: string;
  };
  assignedBy?: {
    id: string;
    name: string;
  };
  leadAssignedDate?: string;
  leadProgressPercent: number;
  expectedClosingDate?: string;
  dealValue?: number;
  conversionProbability?: number;
  lostReason?: string;
  lostReasonNotes?: string;
  activities?: LeadActivity[];
  files?: any[];
  createdAt: string;
  updatedAt: string;
}

interface LeadActivity {
  id: string;
  action: string;
  description: string;
  oldValue?: string;
  newValue?: string;
  user: {
    name: string;
  };
  createdAt: string;
  metadata?: any;
}

interface Filters {
  status?: string;
  priority?: string;
  assignedSalesPersonId?: string;
  leadSource?: string;
  country?: string;
  progressMin?: number;
  progressMax?: number;
  search?: string;
}

const statusColors = {
  NEW_LEAD: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-yellow-100 text-yellow-800",
  INTERESTED: "bg-orange-100 text-orange-800",
  QUALIFIED: "bg-purple-100 text-purple-800",
  MEETING_SCHEDULED: "bg-indigo-100 text-indigo-800",
  PROPOSAL_SENT: "bg-cyan-100 text-cyan-800",
  NEGOTIATION: "bg-pink-100 text-pink-800",
  FOLLOW_UP: "bg-gray-100 text-gray-800",
  WAITING_RESPONSE: "bg-stone-100 text-stone-800",
  WON: "bg-green-100 text-green-800",
  LOST: "bg-red-100 text-red-800",
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [kanbanData, setKanbanData] = useState<Record<string, Lead[]>>({});
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "kanban">("list");
  const [filters, setFilters] = useState<Filters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, filters, searchTerm]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("connect-crm-token");
      if (token) setAuthToken(token);

      const [leadsRes, kanbanRes, analyticsRes] = await Promise.all([
        api.get("/leads"),
        api.get("/leads/kanban/data"),
        api.get("/leads/analytics/overview"),
      ]);

      setLeads(leadsRes.data);
      setKanbanData(kanbanRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      setError("Unable to load leads data.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Other filters
    if (filters.status) {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }
    if (filters.priority) {
      filtered = filtered.filter(lead => lead.priority === filters.priority);
    }
    if (filters.assignedSalesPersonId) {
      filtered = filtered.filter(lead => lead.assignedSalesPerson?.id === filters.assignedSalesPersonId);
    }
    if (filters.leadSource) {
      filtered = filtered.filter(lead => lead.leadSource === filters.leadSource);
    }
    if (filters.country) {
      filtered = filtered.filter(lead => lead.country === filters.country);
    }
    if (filters.progressMin !== undefined) {
      filtered = filtered.filter(lead => lead.leadProgressPercent >= filters.progressMin!);
    }
    if (filters.progressMax !== undefined) {
      filtered = filtered.filter(lead => lead.leadProgressPercent <= filters.progressMax!);
    }

    setFilteredLeads(filtered);
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      await api.patch(`/leads/${leadId}/status`, { status: newStatus });
      await loadData(); // Refresh data
    } catch (err) {
      setError("Failed to update lead status.");
    }
  };

  const getStatusBadge = (status: string) => (
    <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100"}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );

  const getPriorityBadge = (priority: string) => (
    <Badge className={priorityColors[priority as keyof typeof priorityColors] || "bg-gray-100"}>
      {priority}
    </Badge>
  );

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
              <p className="text-gray-600 mt-2">Advanced sales pipeline and lead tracking</p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Lead
              </Button>
            </div>
          </div>

          {/* Analytics Overview */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Leads</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalLeads}</p>
                  </div>
                  <User className="w-8 h-8 text-blue-500" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Won Leads</p>
                    <p className="text-2xl font-bold text-green-600">{analytics.overview.totalWon}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-purple-600">{analytics.overview.conversionRate}%</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-500" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Pipeline</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {analytics.overview.totalLeads - analytics.overview.totalWon}
                    </p>
                  </div>
                  <Phone className="w-8 h-8 text-orange-500" />
                </div>
              </Card>
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <Select onValueChange={(value) => setFilters({...filters, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="NEW_LEAD">New Lead</SelectItem>
                      <SelectItem value="CONTACTED">Contacted</SelectItem>
                      <SelectItem value="QUALIFIED">Qualified</SelectItem>
                      <SelectItem value="WON">Won</SelectItem>
                      <SelectItem value="LOST">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <Select onValueChange={(value) => setFilters({...filters, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Priorities</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lead Source</label>
                  <Select onValueChange={(value) => setFilters({...filters, leadSource: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sources</SelectItem>
                      <SelectItem value="WEBSITE">Website</SelectItem>
                      <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                      <SelectItem value="REFERRAL">Referral</SelectItem>
                      <SelectItem value="COLD_CALL">Cold Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}

          {/* View Toggle */}
          <Tabs value={view} onValueChange={(value) => setView(value as "list" | "kanban")} className="mb-6">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="kanban">Kanban Pipeline</TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <div className="grid gap-6">
                {filteredLeads.map((lead) => (
                  <Card key={lead.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{lead.fullName}</h3>
                        <p className="text-gray-600">{lead.companyName}</p>
                        <p className="text-sm text-gray-500">ID: {lead.leadId}</p>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(lead.status)}
                        {getPriorityBadge(lead.priority)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{lead.email}</span>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{lead.phone}</span>
                        </div>
                      )}
                      {lead.assignedSalesPerson && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{lead.assignedSalesPerson.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-600">{lead.leadProgressPercent}%</span>
                      </div>
                      <Progress value={lead.leadProgressPercent} className="h-2" />
                    </div>

                    {lead.conversionProbability && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Conversion Probability</span>
                          <span className="text-sm text-gray-600">{lead.conversionProbability}%</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {lead.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLead(lead)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="kanban">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Object.entries(kanbanData).map(([status, statusLeads]) => (
                  <div key={status} className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-4 text-center">
                      {status.replace(/_/g, ' ')}
                      <Badge className="ml-2">{statusLeads.length}</Badge>
                    </h3>
                    <div className="space-y-3">
                      {statusLeads.map((lead) => (
                        <Card key={lead.id} className="p-3 cursor-pointer hover:shadow-md">
                          <h4 className="font-medium text-sm">{lead.fullName}</h4>
                          <p className="text-xs text-gray-600">{lead.companyName}</p>
                          <div className="mt-2">
                            <Progress value={lead.leadProgressPercent} className="h-1" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Lead Detail Modal */}
          {selectedLead && (
            <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedLead.fullName}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Lead Information</h3>
                    <div className="space-y-3">
                      <div><strong>ID:</strong> {selectedLead.leadId}</div>
                      <div><strong>Email:</strong> {selectedLead.email}</div>
                      <div><strong>Phone:</strong> {selectedLead.phone}</div>
                      <div><strong>Company:</strong> {selectedLead.companyName}</div>
                      <div><strong>Source:</strong> {selectedLead.leadSource}</div>
                      <div><strong>Budget:</strong> ${selectedLead.budgetValue}</div>
                      <div><strong>Progress:</strong> {selectedLead.leadProgressPercent}%</div>
                      <div><strong>Status:</strong> {getStatusBadge(selectedLead.status)}</div>
                      <div><strong>Priority:</strong> {getPriorityBadge(selectedLead.priority)}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Activities</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedLead.activities?.map((activity) => (
                        <div key={activity.id} className="border-l-2 border-blue-200 pl-3">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-600">
                            {activity.user.name} • {format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Create Lead Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <LeadForm onSuccess={() => {
                setShowCreateDialog(false);
                loadData();
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

function LeadForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    leadSource: "",
    priority: "MEDIUM",
    budgetValue: "",
    country: "",
    city: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/leads", {
        ...formData,
        budgetValue: formData.budgetValue ? parseFloat(formData.budgetValue) : undefined,
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to create lead:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name *</label>
          <Input
            required
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Company</label>
          <Input
            value={formData.companyName}
            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Lead Source</label>
          <Select onValueChange={(value) => setFormData({...formData, leadSource: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WEBSITE">Website</SelectItem>
              <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
              <SelectItem value="REFERRAL">Referral</SelectItem>
              <SelectItem value="COLD_CALL">Cold Call</SelectItem>
              <SelectItem value="EMAIL_CAMPAIGN">Email Campaign</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Priority</label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Budget Value</label>
          <Input
            type="number"
            value={formData.budgetValue}
            onChange={(e) => setFormData({...formData, budgetValue: e.target.value})}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Country</label>
          <Input
            value={formData.country}
            onChange={(e) => setFormData({...formData, country: e.target.value})}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onSuccess()}>
          Cancel
        </Button>
        <Button type="submit">Create Lead</Button>
      </div>
    </form>
  );
}

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <section>
          <header className="mb-8 flex items-center justify-between rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Leads</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Lead pipeline</h1>
            </div>
            <button className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">New lead</button>
          </header>

          <Card>
            <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
              <table className="w-full min-w-max border-separate border-spacing-0 text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  <tr>
                    <th className="px-6 py-4">Lead</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No leads available.</td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id} className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{lead.fullName}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{lead.company || "—"}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{lead.status.replace(/_/g, " ")}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{lead.priority}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">${lead.budget?.toLocaleString() ?? 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          </Card>
        </section>
      </div>
    </main>
  );
}
