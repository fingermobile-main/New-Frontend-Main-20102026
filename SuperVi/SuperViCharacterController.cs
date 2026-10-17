using UnityEngine;
using System.Collections;

// Enum for character types
public enum CharacterType
{
    ZaraTheZephr,      // Red Lion Superhero
    TenkoGen,          // Blue Giraffe Superhero
    KingTheGuardian,   // Green Eagle Superhero
    PhantomShadow,     // Orange Deer Superhero
    BolaTheBrave,      // White Bear Superhero
    NeomaTheHealer     // Yellow Seal Hero
}

// Main character controller for SuperVi game
public class SuperViCharacterController : MonoBehaviour
{
    [Header("Character Configuration")]
    public CharacterType characterType;
    public string characterName;
    public string characterDescription;
    
    [Header("Movement Settings")]
    public float moveSpeed = 5f;
    public float jumpForce = 8f;
    public float gravity = -9.81f;
    public float fallMultiplier = 2.5f; // For more responsive falling
    
    [Header("Orb Settings")]
    public GameObject orbPrefab;
    public Transform orbPosition;
    public Color orbColor;
    public float orbRotationSpeed = 5f;
    
    [Header("Special Ability Settings")]
    public float abilityCooldown = 5f;
    private float abilityTimer;
    private bool abilityAvailable = true;
    
    [Header("Visual Effects")]
    public ParticleSystem[] characterEffects;
    public GameObject[] culturalElements; // Hijab, beads, etc.
    
    // Private variables
    private CharacterController controller;
    private Animator animator;
    private GameObject orbInstance;
    private Vector3 velocity;
    private bool isGrounded;
    private bool facingRight = true;
    
    // Start is called before the first frame update
    void Start()
    {
        controller = GetComponent<CharacterController>();
        animator = GetComponent<Animator>();
        
        // Initialize character-specific settings
        InitializeCharacter();
        
        // Create the orb
        CreateOrb();
        
        // Set initial ability timer
        abilityTimer = abilityCooldown;
    }
    
    // Initialize character-specific settings
    void InitializeCharacter()
    {
        switch(characterType)
        {
            case CharacterType.ZaraTheZephr:
                characterName = "Zara the Zephr";
                characterDescription = "Red Lion Superhero - Levitates above flames, controls fire-based attacks";
                orbColor = Color.red;
                // Additional specific initialization
                break;
                
            case CharacterType.TenkoGen:
                characterName = "Tenko-Gen";
                characterDescription = "Blue Giraffe Superhero - Stretches to reach high places, enhanced vision";
                orbColor = Color.blue;
                // Additional specific initialization
                break;
                
            case CharacterType.KingTheGuardian:
                characterName = "King the Guardian";
                characterDescription = "Green Eagle Superhero - Smashes through walls, rescues civilians";
                orbColor = Color.green;
                // Additional specific initialization
                break;
                
            case CharacterType.PhantomShadow:
                characterName = "Phantom Shadow";
                characterDescription = "Orange Deer Superhero - Phases through obstacles, clears smoke";
                orbColor = new Color(1f, 0.65f, 0f); // Orange
                // Additional specific initialization
                break;
                
            case CharacterType.BolaTheBrave:
                characterName = "Bola the Brave";
                characterDescription = "White Bear Superhero - Lightning speed, protects the young";
                orbColor = Color.white;
                // Additional specific initialization
                break;
                
            case CharacterType.NeomaTheHealer:
                characterName = "Neoma the Healer";
                characterDescription = "Yellow Seal Hero - Creates protective barriers, healing powers";
                orbColor = Color.yellow;
                // Additional specific initialization
                break;
        }
    }
    
    // Create the orb for this character
    void CreateOrb()
    {
        if (orbPrefab != null && orbPosition != null)
        {
            orbInstance = Instantiate(orbPrefab, orbPosition.position, Quaternion.identity);
            orbInstance.transform.SetParent(orbPosition);
            
            // Apply orb-specific color and effects
            Renderer orbRenderer = orbInstance.GetComponent<Renderer>();
            if (orbRenderer != null)
            {
                orbRenderer.material.color = orbColor;
            }
            
            // Set orb rotation based on character type
            StartCoroutine(RotateOrb());
        }
    }
    
    // Rotate the orb around the character
    IEnumerator RotateOrb()
    {
        while (true)
        {
            if (orbInstance != null && orbPosition != null)
            {
                // Rotate orb around character with different patterns based on character type
                float rotationAmount = orbRotationSpeed * Time.deltaTime;
                
                switch(characterType)
                {
                    case CharacterType.ZaraTheZephr:
                        // Fiery rotation pattern
                        orbInstance.transform.RotateAround(orbPosition.position, Vector3.up, rotationAmount * 20);
                        break;
                        
                    case CharacterType.NeomaTheHealer:
                        // Gentle pulsating rotation
                        orbInstance.transform.RotateAround(orbPosition.position, Vector3.forward, rotationAmount * 10);
                        orbInstance.transform.RotateAround(orbPosition.position, Vector3.up, rotationAmount * 5);
                        break;
                        
                    case CharacterType.BolaTheBrave:
                        // Violent spinning pattern
                        orbInstance.transform.RotateAround(orbPosition.position, Vector3.forward, rotationAmount * 50);
                        break;
                        
                    default:
                        // Standard rotation pattern
                        orbInstance.transform.RotateAround(orbPosition.position, Vector3.up, rotationAmount * 15);
                        break;
                }
            }
            
            yield return null;
        }
    }
    
    // Update is called once per frame
    void Update()
    {
        HandleMovement();
        HandleSpecialAbility();
        HandleOrbEffects();
        
        // Update ability timer
        if (!abilityAvailable)
        {
            abilityTimer -= Time.deltaTime;
            if (abilityTimer <= 0)
            {
                abilityAvailable = true;
            }
        }
    }
    
    // Handle character movement
    void HandleMovement()
    {
        isGrounded = controller.isGrounded;
        
        // Horizontal movement (constant in runner game)
        Vector3 move = new Vector3(0, 0, moveSpeed) * Time.deltaTime;
        
        // Apply gravity
        if (!isGrounded)
        {
            velocity.y += gravity * fallMultiplier * Time.deltaTime;
        }
        else
        {
            velocity.y = 0;
        }
        
        // Apply movement
        controller.Move(move + velocity * Time.deltaTime);
    }
    
    // Handle character-specific special ability
    void HandleSpecialAbility()
    {
        // Check for special ability input (space or touch)
        if (Input.GetKeyDown(KeyCode.Space) && abilityAvailable)
        {
            ActivateSpecialAbility();
        }
    }
    
    // Activate the character's special ability
    void ActivateSpecialAbility()
    {
        switch(characterType)
        {
            case CharacterType.ZaraTheZephr:
                // Fire Dash - Creates a fiery path that burns obstacles
                StartCoroutine(FireDashAbility());
                break;
                
            case CharacterType.TenkoGen:
                // Neck Extension - Can reach distant platforms and items
                StartCoroutine(NeckExtensionAbility());
                break;
                
            case CharacterType.KingTheGuardian:
                // Wall Break - Can destroy barriers to create new paths
                StartCoroutine(WallBreakAbility());
                break;
                
            case CharacterType.PhantomShadow:
                // Phase Shift - Can pass through solid objects temporarily
                StartCoroutine(PhaseShiftAbility());
                break;
                
            case CharacterType.BolaTheBrave:
                // Lightning Dash - Ultra-fast movement with protective aura
                StartCoroutine(LightningDashAbility());
                break;
                
            case CharacterType.NeomaTheHealer:
                // Protective Bubbles - Creates healing and protective barriers
                StartCoroutine(ProtectiveBubblesAbility());
                break;
        }
        
        // Set ability on cooldown
        abilityAvailable = false;
        abilityTimer = abilityCooldown;
    }
    
    // Zara's Fire Dash ability
    IEnumerator FireDashAbility()
    {
        // Visual effect
        ActivateCharacterEffect(0);
        
        // Temporarily increase speed and create fire trail
        float originalSpeed = moveSpeed;
        moveSpeed *= 2f;
        
        yield return new WaitForSeconds(2f);
        
        moveSpeed = originalSpeed;
    }
    
    // Tenko-Gen's Neck Extension ability
    IEnumerator NeckExtensionAbility()
    {
        // Visual effect
        ActivateCharacterEffect(1);
        
        // Temporarily increase jump height
        float originalJumpForce = jumpForce;
        jumpForce *= 1.5f;
        
        yield return new WaitForSeconds(3f);
        
        jumpForce = originalJumpForce;
    }
    
    // King's Wall Break ability
    IEnumerator WallBreakAbility()
    {
        // Visual effect
        ActivateCharacterEffect(2);
        
        // For the next few seconds, obstacles are destroyed on contact
        yield return new WaitForSeconds(2f);
    }
    
    // Phantom's Phase Shift ability
    IEnumerator PhaseShiftAbility()
    {
        // Visual effect - make character semi-transparent
        Renderer rend = GetComponent<Renderer>();
        if (rend != null)
        {
            Color originalColor = rend.material.color;
            Color transparentColor = new Color(originalColor.r, originalColor.g, originalColor.b, 0.5f);
            
            rend.material.color = transparentColor;
        }
        
        // Make character temporarily invulnerable to obstacles
        yield return new WaitForSeconds(1.5f);
        
        // Restore original transparency
        if (rend != null)
        {
            Color originalColor = rend.material.color;
            Color opaqueColor = new Color(originalColor.r, originalColor.g, originalColor.b, 1f);
            
            rend.material.color = opaqueColor;
        }
    }
    
    // Bola's Lightning Dash ability
    IEnumerator LightningDashAbility()
    {
        // Visual effect
        ActivateCharacterEffect(3);
        
        // Dramatically increase speed
        float originalSpeed = moveSpeed;
        moveSpeed *= 3f;
        
        yield return new WaitForSeconds(1.5f);
        
        moveSpeed = originalSpeed;
    }
    
    // Neoma's Protective Bubbles ability
    IEnumerator ProtectiveBubblesAbility()
    {
        // Visual effect
        ActivateCharacterEffect(4);
        
        // Activate protective bubble
        yield return new WaitForSeconds(5f);
    }
    
    // Activate a specific character effect
    void ActivateCharacterEffect(int effectIndex)
    {
        if (effectIndex < characterEffects.Length && characterEffects[effectIndex] != null)
        {
            characterEffects[effectIndex].Play();
        }
    }
    
    // Handle orb-specific visual effects
    void HandleOrbEffects()
    {
        // Different visual effects based on character type
        switch(characterType)
        {
            case CharacterType.ZaraTheZephr:
                // Fiery particles around orb
                break;
                
            case CharacterType.NeomaTheHealer:
                // Gentle healing particles
                break;
                
            case CharacterType.BolaTheBrave:
                // Fast spinning particles
                break;
        }
    }
    
    // Called when character collides with something
    void OnControllerColliderHit(ControllerColliderHit hit)
    {
        // Handle different collision types based on character ability
        if (characterType == CharacterType.KingTheGuardian)
        {
            // King can break through certain obstacles
            if (hit.gameObject.CompareTag("Breakable"))
            {
                Destroy(hit.gameObject);
            }
        }
    }
    
    // Get the current ability cooldown status
    public float GetAbilityCooldownStatus()
    {
        return abilityAvailable ? 0 : (abilityTimer / abilityCooldown);
    }
    
    // Get character-specific color for UI elements
    public Color GetCharacterColor()
    {
        switch(characterType)
        {
            case CharacterType.ZaraTheZephr: return Color.red;
            case CharacterType.TenkoGen: return Color.blue;
            case CharacterType.KingTheGuardian: return Color.green;
            case CharacterType.PhantomShadow: return new Color(1f, 0.65f, 0f); // Orange
            case CharacterType.BolaTheBrave: return Color.white;
            case CharacterType.NeomaTheHealer: return Color.yellow;
            default: return Color.gray;
        }
    }
}