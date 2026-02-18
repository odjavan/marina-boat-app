import os

def main():
    print("Executando script de exemplo...")
    
    # Simula processamento
    output_dir = ".tmp"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    log_file = os.path.join(output_dir, "exemplo.log")
    with open(log_file, "w") as f:
        f.write("Execução bem-sucedida em " + os.getcwd())
        
    print(f"Log criado em {log_file}")

if __name__ == "__main__":
    main()
