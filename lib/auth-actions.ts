"use server"

export async function signIn(prevState: any, formData: FormData) {
  return { error: "Authentication temporarily disabled" }
}

export async function signUp(prevState: any, formData: FormData) {
  return { error: "Authentication temporarily disabled" }
}

export async function signOut() {
  // Temporarily disabled
}
