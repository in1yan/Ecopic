import { API_BASE_URL, getAuthHeaders } from '@/config/api';

const API_BASE = API_BASE_URL;

// ========== SUPPORT TICKETS TYPES ==========

export interface SupportTicket {
    id: number;
    farmerName: string;
    farmerId: string;
    category: 'Emergency' | 'Technical' | 'Expert' | 'General';
    subcategory: string;
    subject: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    assignedTo: string;
    contactPhone: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt: string | null;
    responses: TicketResponse[];
}

export interface TicketResponse {
    by: string;
    message: string;
    timestamp: string;
}

export interface TicketStats {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    byCategory: {
        emergency: number;
        expert: number;
        technical: number;
        general: number;
    };
    byPriority: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
}

export interface CreateTicketDto {
    farmerName: string;
    category: string;
    subcategory?: string;
    subject: string;
    description: string;
    priority?: string;
    contactPhone: string;
}

export interface UpdateTicketDto {
    status?: string;
    assignedTo?: string;
    response?: {
        by?: string;
        message: string;
    };
}

// ========== NEWS & SCHEMES TYPES ==========

export interface NewsArticle {
    id: number;
    category: 'Government Scheme' | 'Subsidy' | 'Grant' | 'Workshop' | 'Alert';
    title: string;
    preview: string;
    content: string;
    publishDate: string;
    expiryDate: string | null;
    isFeatured: boolean;
    link: string | null;
    tags: string[];
    views: number;
}

// ========== HELPLINES TYPES ==========

export interface Helpline {
    id: number;
    category: 'emergency' | 'expert' | 'support';
    title: string;
    description: string;
    phone: string;
    whatsapp: string;
    email: string;
    availability: string;
    isActive: boolean;
    priority: number;
    color: string;
}

// ========== SUPPORT TICKETS API ==========

export const getAllTickets = async (params?: {
    status?: string;
    category?: string;
    priority?: string;
}): Promise<SupportTicket[]> => {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const response = await fetch(`${API_BASE}/ecoconnect/tickets?${queryParams}`, {
        headers: getAuthHeaders()
    });
    const data = await response.json();
    return data.data;
};

export const getTicketById = async (id: number): Promise<SupportTicket> => {
    const response = await fetch(`${API_BASE}/ecoconnect/tickets/${id}`, {
        headers: getAuthHeaders()
    });
    const data = await response.json();
    return data.data;
};

export const createTicket = async (ticketData: CreateTicketDto): Promise<SupportTicket> => {
    const response = await fetch(`${API_BASE}/ecoconnect/tickets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(ticketData),
    });
    const data = await response.json();
    return data.data;
};

export const updateTicket = async (id: number, updateData: UpdateTicketDto): Promise<SupportTicket> => {
    const response = await fetch(`${API_BASE}/ecoconnect/tickets/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
    });
    const data = await response.json();
    return data.data;
};

export const getTicketStats = async (): Promise<TicketStats> => {
    const response = await fetch(`${API_BASE}/ecoconnect/tickets/stats`, {
        headers: getAuthHeaders()
    });
    const data = await response.json();
    return data.data;
};

// ========== NEWS & SCHEMES API ==========

export const getAllNews = async (params?: {
    category?: string;
    featured?: boolean;
    limit?: number;
}): Promise<NewsArticle[]> => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await fetch(`${API_BASE}/ecoconnect/news?${queryParams}`, {
        headers: getAuthHeaders()
    });
    const data = await response.json();
    return data.data;
};

export const getNewsById = async (id: number): Promise<NewsArticle> => {
    const response = await fetch(`${API_BASE}/ecoconnect/news/${id}`, {
        headers: getAuthHeaders()
    });
    const data = await response.json();
    return data.data;
};

// ========== HELPLINES API ==========

export const getAllHelplines = async (params?: {
    category?: string;
    active?: boolean;
}): Promise<Helpline[]> => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    
    const response = await fetch(`${API_BASE}/ecoconnect/helplines?${queryParams}`, {
        headers: getAuthHeaders()
    });
    const data = await response.json();
    return data.data;
};
