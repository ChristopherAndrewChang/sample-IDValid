export type VERIFY_2FA_CONTENT_PROPS = {
  setLoading: (loading: boolean) => void;
  onClose: (success: boolean, token?) => void;
}