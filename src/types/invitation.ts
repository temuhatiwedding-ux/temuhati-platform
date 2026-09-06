export interface InvitationData {
    template_id: string;
    bride_name: string;
    groom_name: string;
    content_data: {
        coverPhoto?: string;
        musicUrl?: string;
        quote?: string;
        bride_details?: { fullName: string; order: string; parents: string; ig: string };
        groom_details?: { fullName: string; order: string; parents: string; ig: string };
        events?: {
            akad?: { date: string; time: string; location: string; mapUrl: string };
            resepsi?: { date: string; time: string; location: string; mapUrl: string };
        };
        gift?: { enabled: boolean; banks: { name: string; account: string; holder: string }[] };
        live_stream?: { enabled: boolean; url: string };
        closing_text?: string;
        sections: {
            gallery: { enabled: boolean; photos?: string[] };
        };
    };
}