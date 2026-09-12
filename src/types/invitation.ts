export interface InvitationData {
    invitation_id?: string;
    template_id: string;
    bride_name: string;
    groom_name: string;
    isPreview?: boolean;
    content_data: {
        coverPhoto?: string;
        bgPhoto?: string;
        closingPhoto?: string;
        bridePhoto?: string;
        groomPhoto?: string;
        musicUrl?: string;
        quote?: string;
        bride_details?: { fullName: string; order: string; fatherName: string; motherName: string; ig: string };
        groom_details?: { fullName: string; order: string; fatherName: string; motherName: string; ig: string };
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
        love_story?: { enabled: boolean; stories: { year: string; text: string }[] };
    };
}